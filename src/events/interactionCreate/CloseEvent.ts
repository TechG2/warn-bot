import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import schedule from "node-schedule";
import TicketModel from "../../Schemas/TicketModel";
import { CustomClient } from "../../classes/CustomClient";
import Event from "../../classes/Event";
import createTranscript from "../../functions/createTranscript";

export default class CloseEvent extends Event {
  constructor(client: CustomClient) {
    super(client, {
      once: false,
    });
  }

  async execute(interaction: ButtonInteraction): Promise<void> {
    if (!interaction.isButton() || !interaction.customId) return;
    if (
      interaction.customId !== "ticketCloseCancel" &&
      interaction.customId !== "ticketClose" &&
      !interaction.customId.startsWith("ticketClosingCancel2-")
    )
      return;

    const member = await interaction.guild!.members.fetch(interaction.user.id);
    const isStaff = member.roles.cache.some((role) =>
      [
        ...this.client.config.staff.staffRoles,
        ...this.client.config.staff.headRoles,
      ].includes(role.id)
    );
    if (!isStaff) {
      await interaction.reply({
        ephemeral: true,
        content: "Non hai i permessi necessari per eseguire questa azione.",
      });
      return;
    }

    if (interaction.customId === "ticketCloseCancel") {
      const closeEmbed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle("Ticket")
        .setDescription("Chiusura del ticket annullata.")
        .setTimestamp();

      await interaction.update({ embeds: [closeEmbed], components: [] });
    } else if (interaction.customId === "ticketClose") {
      // task
      const task = schedule.scheduleJob(
        new Date(Date.now() + 10000),
        async () => {
          const ticket = await TicketModel.findOne({
            channelId: interaction.channel!.id,
            isClosed: false,
          });
          if (!ticket) return;

          // Transcript
          const channel = interaction.channel! as TextChannel;
          const transcript = await createTranscript(channel, { ticket });

          // embed + attach
          const closeEmbed = new EmbedBuilder()
            .setColor(Colors.DarkRed)
            .setTitle("Ticket Chiuso")
            .setDescription(`Il tuo ticket è stato chiuso.`)
            .addFields(
              {
                name: "Creato da",
                value: `<@${ticket.authorId}>`,
                inline: true,
              },
              { name: "Chiuso da", value: `${interaction.user}`, inline: true },
              { name: "Ticket", value: channel.name, inline: true },
              {
                name: "Categoria",
                value: this.client.config.tickets.categories.find(
                  (cateogory) => cateogory.type === ticket.categoryType
                )!.name
                  ? this.client.config.tickets.categories.find(
                      (cateogory) => cateogory.type === ticket.categoryType
                    )!.name
                  : "HeadStaff",
                inline: true,
              },
              {
                name: "Messsaggi",
                value: (await channel.messages.fetch({ limit: 100 }))
                  .map((m) => m)
                  .length.toString(),
                inline: true,
              }
            )
            .setTimestamp();
          const transcriptAttach = new AttachmentBuilder(transcript.buffer, {
            name: "transcript.txt",
          });

          const user = await this.client.users
            .fetch(ticket.authorId)
            .catch(() => {});
          if (user) {
            await user.send({ embeds: [closeEmbed] }).catch(() => {});
            await user.send({ files: [transcriptAttach] }).catch(() => {});
          }

          // other
          const userAdded = ticket.userAdded as { users: string[] };
          userAdded.users.forEach(async (user) => {
            const userOther = await this.client.users
              .fetch(user)
              .catch(() => {});
            if (userOther) {
              await userOther.send({ embeds: [closeEmbed] }).catch(() => {});
              await userOther
                .send({ files: [transcriptAttach] })
                .catch(() => {});
            }
          });

          // Delete channel
          await interaction.channel!.delete();
          await TicketModel.updateOne(
            { _id: ticket._id },
            {
              $set: {
                isClosed: true,
                closeInfo: { by: interaction.user.id, at: new Date() },
                trascript: transcript.buffer,
              },
            }
          );
        }
      );

      const closeEmbed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle("Chiudi il Ticket")
        .setDescription(
          "Chiusura del ticket, il ticket verrà chiuso in 10 secondi."
        )
        .setTimestamp();
      const cancelBtn = new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setLabel("Annulla")
        .setCustomId(`ticketClosingCancel2-${task.name}`);
      const closeRow = new ActionRowBuilder<ButtonBuilder>().setComponents(
        cancelBtn
      );

      await interaction.update({
        embeds: [closeEmbed],
        components: [closeRow],
      });
    } else if (interaction.customId.startsWith("ticketClosingCancel2-")) {
      const taskName = interaction.customId.replace(
        "ticketClosingCancel2-",
        ""
      );
      const task = schedule.scheduledJobs[taskName];
      if (!task) {
        await interaction.reply({
          ephemeral: true,
          content: "C'è stato un problema.",
        });
        return;
      } else task.cancel();

      const closeEmbed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle("Ticket")
        .setDescription("Chiusura del ticket annullata.")
        .setTimestamp();

      await interaction.update({ embeds: [closeEmbed], components: [] });
    }
  }
}
