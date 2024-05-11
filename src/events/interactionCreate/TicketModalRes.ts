import {
  Colors,
  EmbedBuilder,
  ModalSubmitInteraction,
  PermissionsBitField,
} from "discord.js";
import ticketModel from "../../Schemas/TicketModel";
import { CustomClient } from "../../classes/CustomClient";
import Event from "../../classes/Event";
import { staff, tickets, wikiUrl } from "../../config/config.json";

export default class TicketModalRes extends Event {
  constructor(client: CustomClient) {
    super(client, {
      once: false,
    });
  }

  async execute(interaction: ModalSubmitInteraction): Promise<void> {
    if (!interaction.isModalSubmit() || !interaction.customId) return;

    if (interaction.customId.startsWith("openTicketModal-")) {
      await interaction.reply({
        ephemeral: true,
        content: "Ticket in creazione...",
      });

      const categoryIndex = +interaction.customId.replace(
        "openTicketModal-",
        ""
      );
      const category = tickets.categories[categoryIndex];
      if (!category) {
        await interaction.editReply({
          content: "C'è stato un errore",
        });
        return;
      }
      const values = category.questions
        .map((question) => ({
          question: question.question,
          answer: interaction.fields.getTextInputValue(question.id),
        }))
        .filter((value) => value.answer && value.answer !== "");

      // Check ticket
      const alreadyExist = await ticketModel.findOne({
        authorId: interaction.user.id,
        isClosed: false,
      });
      if (alreadyExist) {
        const checkTicket = await interaction.guild?.channels
          .fetch(alreadyExist.channelId)
          .catch(() => {});

        if (checkTicket) {
          await interaction.editReply({
            content: `Hai già un ticket aperto, <#${alreadyExist.channelId}>.`,
          });
          return;
        } else await alreadyExist.deleteOne();
      }

      // Create channel
      const channel = await interaction.guild!.channels.create({
        name: `ticket-${interaction.user.username}`,
        topic: `Ticket create da ${interaction.user} sotto la categoria ${category.name}.`,
        parent: category.categoryId,
        reason: "Creazione ticket.",
        permissionOverwrites: [
          {
            id: interaction.guild!.id,
            deny: [
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ViewChannel,
            ],
          },
          {
            id: interaction.user.id,
            allow: [
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ViewChannel,
            ],
          },
          ...staff.headRoles.map((roleId) => ({
            id: roleId,
            allow: [
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ViewChannel,
            ],
          })),
          ...staff.staffRoles.map((roleId) => ({
            id: roleId,
            [category.isHeadOnly ? "deny" : "allow"]: [
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ViewChannel,
            ],
          })),
        ],
      });

      // Db
      const ticket = new ticketModel({
        authorId: interaction.user.id,
        categoryId: category.categoryId,
        channelId: channel.id,
        categoryType: category.type,
        questions: values,
      });
      ticket.save();

      // Output
      await interaction.editReply({
        content: `Ticket creato con successo, ${channel}.`,
      });

      // Send channel
      const ticketEmbed = new EmbedBuilder()
        .setColor(Colors.DarkOrange)
        .setAuthor({
          name: "Backroom Wiki",
          iconURL: interaction.guild?.iconURL()!,
          url: wikiUrl,
        })
        .setTitle("Ticket aperto")
        .setDescription(
          `${interaction.user}, il tuo ticket è stato aperto con successo. Perfavore attendi risposta da un membro dello staff.`
        )
        .setFields({
          name: "Domande:",
          value: values
            .map(
              (question, index) =>
                `${index + 1}. ${question.question}\n\`\`\`${
                  question.answer
                }\`\`\``
            )
            .join("\n"),
        })
        .setTimestamp()
        .setFooter({ text: interaction.guild!.name });

      await channel
        .send(
          `${interaction.user}, ${
            category.isHeadOnly
              ? staff.headRoles.map((roleId) => `<@&${roleId}>`)
              : staff.staffRoles.map((roleId) => `<@&${roleId}>`)
          }`
        )
        .then((message) => setTimeout(() => message.delete(), 1000));
      const ticketMessage = await channel.send({
        embeds: [ticketEmbed],
      });
      ticketMessage.pin();
    }
  }
}
