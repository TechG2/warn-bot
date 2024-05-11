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

export default class Add extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("add")
        .setDescription("Aggiunge un utente al ticket")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("L'utente d'aggiungere")
            .setRequired(true)
        ),
    });
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    // User
    const userToAdd = interaction.options.getUser("user")!;
    const user = await interaction
      .guild!.members.fetch(userToAdd.id)
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
        content: "Non puoi aggiungerti da solo.",
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

    // Errors
    if (ticket.userAdded.users && ticket.userAdded.users.includes(user.id)) {
      await interaction.reply({
        ephemeral: true,
        content: "Non puoi aggiungere questo utente.",
      });
      return;
    }
    if (
      ticket.userAdded.users &&
      ticket.userAdded.users.includes(ticket.authorId)
    ) {
      await interaction.reply({
        ephemeral: true,
        content: "Non puoi aggiungere questo utente.",
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

    // Channel
    const channel = interaction.channel! as TextChannel;

    // Add
    await channel.permissionOverwrites.create(user.id, {
      SendMessages: true,
      ViewChannel: true,
    });

    // Update
    await TicketModel.updateOne(
      { _id: ticket._id },
      { $push: { "userAdded.users": user.id } }
    );

    // Output
    const addEmbed = new EmbedBuilder()
      .setColor(Colors.DarkOrange)
      .setTitle("Utente Aggiunto")
      .setDescription(
        `${user.user} è stato aggiunto al ticket da ${interaction.user}.`
      )
      .setTimestamp();

    await interaction.reply({
      embeds: [addEmbed],
    });
  }
}
