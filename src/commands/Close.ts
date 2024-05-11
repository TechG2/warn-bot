import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import TicketModel from "../Schemas/TicketModel";
import Command from "../classes/Command";
import { CustomClient } from "../classes/CustomClient";

export default class Close extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("close")
        .setDescription("Chiude un ticket."),
    });
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.channel) return;

    // Check ticket
    const member = await interaction.guild!.members.fetch(interaction.user.id);
    const isStaff = member.roles.cache.some((role) =>
      [
        ...this.client.config.staff.staffRoles,
        ...this.client.config.staff.headRoles,
      ].includes(role.id)
    );

    const isTicket = await TicketModel.findOne({
      channelId: interaction.channel.id,
      isClosed: false,
    });
    if (!isTicket) {
      await interaction.reply({
        ephemeral: true,
        content: "Questo canale non è un ticket.",
      });
      return;
    }

    // embed
    const closeEmbed = new EmbedBuilder()
      .setColor(Colors.Red)
      .setTitle("Chiudi il Ticket")
      .setDescription(
        `${interaction.user}, sei sicuro di voler chiudere il ticket?`
      )
      .setTimestamp();
    if (!isStaff) {
      (closeEmbed as EmbedBuilder).setDescription(
        `${interaction.user} ha richiesto la chiusura del ticket.`
      );

      const pingMsg = await interaction.channel.send(
        `${interaction.user}, ${this.client.config.staff.staffRoles.map(
          (roleId) => `<@&${roleId}>`
        )}`
      );
      setTimeout(() => pingMsg.delete(), 1000);
    }

    const closeBtn = new ButtonBuilder()
      .setStyle(ButtonStyle.Danger)
      .setLabel("Chiudi")
      .setCustomId("ticketClose")
      .setEmoji("🔒");
    const cancelBtn = new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setLabel("Annulla")
      .setCustomId("ticketCloseCancel");
    const closeRow = new ActionRowBuilder<ButtonBuilder>().setComponents(
      closeBtn,
      cancelBtn
    );

    await interaction.reply({
      ephemeral: isStaff,
      components: [closeRow],
      embeds: [closeEmbed],
    });
  }
}
