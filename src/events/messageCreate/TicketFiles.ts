import { Colors, EmbedBuilder, Message } from "discord.js";
import TicketModel from "../../Schemas/TicketModel";
import { CustomClient } from "../../classes/CustomClient";
import Event from "../../classes/Event";

export default class TicketFiles extends Event {
  constructor(client: CustomClient) {
    super(client, { once: false });
  }

  async execute(message: Message): Promise<void> {
    if (this.client.user!.id === message.author.id) return;

    const ticket = await TicketModel.findOne({
      authorId: message.author.id,
      isClosed: false,
    });
    if (!ticket) return;
    if (!message.attachments.map((item) => item)[0]) return;

    await message.delete();
    await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.DarkRed)
          .setAuthor({ name: "Backroom Wiki", url: this.client.config.wikiUrl })
          .setTitle("File")
          .setDescription(
            `${message.author}, per ragioni di sicurezza, non ti è consentito allegare file dentro ai ticket. Se intendi allegare un file utilizza il comando /upload.`
          )
          .setTimestamp()
          .setFooter({
            text: message.guild!.name,
          }),
      ],
    });
  }
}
