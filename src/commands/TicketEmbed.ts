import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import Command from "../classes/Command";
import { CustomClient } from "../classes/CustomClient";
import { wikiUrl } from "../config/config.json";

export default class TicketEmbed extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("ticket-embed")
        .setDescription("Invia l'embed per aprire un ticket.")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    });
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const ticketEmbed = new EmbedBuilder()
      .setAuthor({
        name: "Backroom Wiki",
        iconURL: interaction.guild?.iconURL()!,
        url: wikiUrl,
      })
      .setColor(Colors.Blue)
      .setTitle("Apri un Ticket!")
      .setDescription("Premi uno dei bottoni qui sotto per aprire un ticket.")
      .setTimestamp()
      .setFooter({
        text: interaction.guild!.name,
      });

    const openBtn = new ButtonBuilder()
      .setEmoji("🎟️")
      .setLabel("Supporto")
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("openTicket");
    const appBtn = new ButtonBuilder()
      .setEmoji("⚒️")
      .setLabel("Staff")
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("openApp");
    const ticketRow = new ActionRowBuilder<ButtonBuilder>().setComponents(
      openBtn,
      appBtn
    );

    await interaction.channel?.send({
      embeds: [ticketEmbed],
      components: [ticketRow],
    });
    await interaction.reply({
      ephemeral: true,
      content: "Embed inviato con successo.",
    });
  }
}
