import axios from "axios";
import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import Command from "../classes/Command";
import { CustomClient } from "../classes/CustomClient";

export default class DataBase extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("database")
        .setDescription("Cerca nella wiki un articolo.")
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("Parole chiave da cercare.")
            .setRequired(true)
        ),
    });
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    // options
    const query = interaction.options.getString("query", true);

    // Search
    const response = await axios.get(
      `https://backrooms.fandom.com/it/api.php?action=parse&page=${query}&format=json`
    );
    const data = response.data;
    const exist: boolean = data.error ? false : true;
    if (!exist) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: "Backroom Wiki",
              url: this.client.config.wikiUrl,
            })
            .setColor(Colors.DarkOrange)
            .setTitle(`404`)
            .setDescription("La ricerca non ha fruttato risultati")
            .setTimestamp()
            .setFooter({ text: interaction.guild!.name }),
        ],
      });
      return;
    }

    // Image
    const result: {
      parse: {
        title: any;
        pageid: string;
        displaytitle: string;
        images: string[];
      };
    } = data;
    const imageResponse = await axios
      .get(
        `https://backrooms.fandom.com/it/api.php?action=imageserving&wisTitle=${result.parse.title}&format=json`
      )
      .catch(() => {});
    const getImage = imageResponse?.data;
    const imageExist = getImage && !getImage.error ? true : false;

    console.log();

    // Embed
    const finalEmbed = new EmbedBuilder()
      .setAuthor({
        name: "Backroom Wiki",
        url: this.client.config.wikiUrl,
      })
      .setColor(Colors.DarkOrange)
      .setURL(
        `${this.client.config.wikiUrl}/${result.parse.title.replaceAll(
          " ",
          "_"
        )}`
      )
      .setTitle(`**${result.parse.title}**`)
      .setDescription(`Risutlato trovato: **${result.parse.displaytitle}**.`)
      .setTimestamp()
      .setFooter({ text: interaction.guild!.name });
    if (imageExist) finalEmbed.setThumbnail(getImage.image.imageserving);

    await interaction.reply({
      embeds: [finalEmbed],
    });
  }
}
