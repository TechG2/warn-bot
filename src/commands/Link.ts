import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import puppeteer from "puppeteer";
import VerifyModel from "../Schemas/VerifyModel";
import Command from "../classes/Command";
import { CustomClient } from "../classes/CustomClient";
import { wikiUrl } from "../config/config.json";

export default class Link extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("link")
        .setDescription("Linka il tuo accound discord con quello fandom.")
        .addStringOption((option) =>
          option
            .setName("fandom-name")
            .setDescription("Il tuo nome utente Fandom.")
            .setRequired(true)
        ),
    });
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply({
      ephemeral: true,
      content: "Caricamento in corso...",
    });

    // Get options
    const fandomName = interaction.options.getString("fandom-name")!;

    // Check user
    const toVerifyUser = await VerifyModel.findOne({
      userId: interaction.user.id,
    });
    if (!toVerifyUser) {
      await interaction.editReply({
        content:
          "C'è stato un errore. Per linkare l'account vai sul canale di verifica.",
      });
      return;
    }

    // getUser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Dev
    await page.goto(`${wikiUrl}/Utente:${fandomName}`, {
      waitUntil: "networkidle0",
    });

    const exist = await page.evaluate((): string | null => {
      const el: Element | null = document.querySelector(
        ".user-identity-social__icon-tooltip.wds-dropdown__content"
      );
      return el ? (el as HTMLSpanElement).innerText : null;
    });
    if (!exist || exist !== interaction.user.username) {
      await interaction.editReply({
        content: "L'account fornito non è collegato al tuo tag discord.",
      });
      return;
    }

    // Add roles
    const message = await interaction
      .channel!.messages.fetch(toVerifyUser.messageId)
      .catch(() => {});
    const member = await interaction
      .guild!.members.fetch(interaction.user.id)
      .catch(() => {});
    if (!member || !message) {
      await interaction.editReply({ content: "C'è stato un errore." });
      return;
    }

    // Update db
    await VerifyModel.updateOne(
      { _id: toVerifyUser._id },
      {
        $set: {
          "fandomInfo.info": {
            fandomName,
            fandomDiscordId: interaction.user.id,
            fandomUrl: `${wikiUrl}/User:${fandomName}`,
          },
          "fandomInfo.fandomLinked": true,
          finished: true,
        },
      }
    );

    // Edit msg
    const newEmbed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle("Account connesso")
      .setDescription(
        "Hai connesso correttamente l'account fandom con il tuo discord. Completa la verifica premendo il bottone qui sotto."
      )
      .setTimestamp()
      .setFooter({
        text: interaction.guild!.name,
        iconURL: interaction.guild?.iconURL()!,
      });

    const completeBtn = new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setLabel("Completa")
      .setCustomId("completeVerify");
    const newRow = new ActionRowBuilder<ButtonBuilder>().setComponents(
      completeBtn
    );

    await message.edit({
      embeds: [newEmbed],
      components: [newRow],
    });

    await interaction.editReply({
      content: "Account Fandom connesso correttamente con il discord.",
    });
  }
}
