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

export default class VerifyEmbed extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("verify-embed")
        .setDescription("Invia l'embed per verificarsi cket.")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    });
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const verifyEmbed = new EmbedBuilder()
      .setAuthor({
        name: "Backroom Wiki",
        iconURL: interaction.guild?.iconURL()!,
        url: wikiUrl,
      })
      .setColor(Colors.Blue)
      .setTitle("Processo di verifica!")
      .setDescription(
        "Per procedere nel server dovrai sottoporti ad un processo di verifica. Per proseguire premi il bottone qui sotto!"
      )
      .setTimestamp()
      .setFooter({
        text: interaction.guild!.name,
      });

    const verifyBtn = new ButtonBuilder()
      .setLabel("Verificati")
      .setStyle(ButtonStyle.Success)
      .setCustomId("verifyStart");
    const infoBtn = new ButtonBuilder()
      .setLabel("Informazioni")
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("verifyInfoOpen");
    const verifyRow = new ActionRowBuilder<ButtonBuilder>().setComponents(
      verifyBtn,
      infoBtn
    );

    await interaction.channel?.send({
      embeds: [verifyEmbed],
      components: [verifyRow],
    });
    await interaction.reply({
      ephemeral: true,
      content: "Embed inviato con successo.",
    });
  }
}
