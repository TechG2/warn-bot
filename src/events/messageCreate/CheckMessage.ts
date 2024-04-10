import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  Message,
} from "discord.js";
import { CustomClient } from "../../classes/CustomClient";
import Event from "../../classes/Event";
import config from "../../config/config.json";

export default class CheckMessage extends Event {
  constructor(client: CustomClient) {
    super(client, {
      once: false,
    });
  }

  async execute(message: Message): Promise<void> {
    const bannedWords = config.bannedWords;
    if (
      !bannedWords.some((word: string) =>
        message.content.toLowerCase().includes(word.toLowerCase())
      )
    )
      return;

    const channel = await message.guild!.channels.fetch(config.warnChannel);
    if (!channel || !channel.isTextBased()) return;

    const warningEmbed = new EmbedBuilder()
      .setColor(Colors.DarkRed)
      .setTitle("Segnalazione")
      .setDescription(`${message.author}: ${message.content}`)
      .setTimestamp()
      .setThumbnail(message.author.displayAvatarURL())
      .setFooter({
        text: message.guild!.name,
        iconURL: message.guild?.iconURL()!,
      });

    const banBtn = new ButtonBuilder()
      .setLabel("Sanziona")
      .setStyle(ButtonStyle.Danger)
      .setCustomId(`banMenu-${message.author.id}`);
    const goBtn = new ButtonBuilder()
      .setLabel("Messaggio")
      .setStyle(ButtonStyle.Link)
      .setURL(message.url);

    const warningRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      banBtn,
      goBtn
    );

    await channel.send({ embeds: [warningEmbed], components: [warningRow] });
  }
}
