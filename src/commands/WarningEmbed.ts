import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import Command from "../classes/Command";
import { CustomClient } from "../classes/CustomClient";
import { wikiUrl } from "../config/config.json";

export default class WarningEmbed extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("warning-embed")
        .setDescription("Invia l'embed d'avviso dello stato WIP del server.")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    });
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const warningEmbed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setAuthor({
        iconURL: interaction.guild?.iconURL()!,
        name: "Backroom Wiki",
        url: wikiUrl,
      })
      .setTitle("Manutenzione!")
      .setDescription("Il server è al momento in manutenzione.")
      .setTimestamp()
      .setFooter({
        text: interaction.guild!.name,
      });

    await interaction.channel?.send({
      embeds: [warningEmbed],
    });
    await interaction.reply({
      ephemeral: true,
      content: "Embed inviato con successo.",
    });
  }
}
