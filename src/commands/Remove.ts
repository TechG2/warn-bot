import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import TicketModel from "../Schemas/TicketModel";
import Command from "../classes/Command";
import { CustomClient } from "../classes/CustomClient";

export default class Remove extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Rimuove un utente dal ticket")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("L'utente da rimuovere")
            .setRequired(true)
        ),
    });
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    // User
    const userToRemove = interaction.options.getUser("user")!;
    const user = await interaction
      .guild!.members.fetch(userToRemove.id)
      .catch(() => {});
    if (!user) {
      await interaction.reply({
        ephemeral: true,
        content: "L'utente selezionato non è valido o non è nel discord.",
      });
      return;
    }
    if (user.id === interaction.user.id) {
      await interaction.reply({
        ephemeral: true,
        content: "Non puoi rimuoverti da solo.",
      });
      return;
    }

    // Check staff
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
        content: "Non hai i permessi necessari per eseguire questo comando.",
      });
      return;
    }

    // Check ticket
    const ticket = await TicketModel.findOne({
      channelId: interaction.channel!.id,
      isClosed: false,
    });
    if (!ticket) {
      await interaction.reply({
        ephemeral: true,
        content: "Questo canale non è un ticket.",
      });
      return;
    }

    if (ticket.userAdded.users && !ticket.userAdded.users.includes(user.id)) {
      await interaction.reply({
        ephemeral: true,
        content: "Questo utente non è dentro al ticket.",
      });
      return;
    }

    // perms
    const channel = interaction.channel! as TextChannel;
    await channel.permissionOverwrites.create(user.id, {
      ViewChannel: false,
      SendMessages: false,
    });

    // update
    await TicketModel.updateOne(
      { _id: ticket._id },
      { $pull: { "userAdded.users": user.id } }
    );

    // Output
    const addEmbed = new EmbedBuilder()
      .setColor(Colors.DarkRed)
      .setTitle("Utente Rimosso")
      .setDescription(
        `${user.user} è stato rimosso dal ticket da ${interaction.user}.`
      )
      .setTimestamp();

    await interaction.reply({
      embeds: [addEmbed],
    });
  }
}
