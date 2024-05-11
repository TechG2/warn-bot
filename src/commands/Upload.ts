import axios from "axios";
import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import dotenv from "dotenv";
import FormData from "form-data";
import Command from "../classes/Command";
import { CustomClient } from "../classes/CustomClient";

dotenv.config();
const virusTotalKey = process.env.VIRUS_KEY!;

export default class Upload extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("upload")
        .setDescription(
          "Questo comando esegue una scansione ad un file prima di inviarlo in un canale."
        )
        .addAttachmentOption((option) =>
          option
            .setName("file")
            .setDescription("Il file da allegare")
            .setRequired(true)
        ),
    });
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    // get Attach
    const fileAttachment = interaction.options.getAttachment("file", true);

    // get file
    const response = await axios.get(fileAttachment.url, {
      responseType: "arraybuffer",
    });

    const formData = new FormData();
    formData.append("file", response.data, fileAttachment.name);

    const fileEmbed = new EmbedBuilder()
      .setColor(Colors.DarkOrange)
      .setAuthor({ name: "Backroom Wiki", url: this.client.config.wikiUrl })
      .setTitle("File")
      .setDescription(`${interaction.user} sta caricando un file.`)
      .setTimestamp()
      .setFooter({ text: interaction.guild!.name });
    await interaction.reply({ embeds: [fileEmbed] });

    try {
      const uploadResponse = await axios.post(
        "https://www.virustotal.com/api/v3/files",
        formData,
        {
          headers: {
            "x-apikey": virusTotalKey,
            ...formData.getHeaders(),
          },
        }
      );

      const dataId = uploadResponse.data.data.id;
      await new Promise((resolve) => setTimeout(resolve, 15000));

      const reportResponse = await axios.get(
        `https://www.virustotal.com/api/v3/analyses/${dataId}`,
        {
          headers: { "x-apikey": virusTotalKey },
        }
      );

      if (reportResponse.data.data.attributes.stats.malicious > 0) {
        fileEmbed
          .setColor(Colors.DarkRed)
          .setDescription(
            `${interaction.user}, il tuo file potrebbe essere un file malevolo, quindi è stato bloccato.`
          );
        await interaction.editReply({ embeds: [fileEmbed] });
      } else {
        fileEmbed
          .setDescription(
            `${interaction.user}, il tuo file è risultato pulito alla scansione.`
          )
        const reply = await interaction.editReply({ embeds: [fileEmbed] });

        const file = new AttachmentBuilder(response.data, {
          name: fileAttachment.name,
        });
        await reply.reply({
          files: [file],
        });
      }
    } catch (error: any) {
      console.log(error);
      await interaction.editReply(
        "C’è stato un errore durante la scansione del file."
      );
    }
  }
}
