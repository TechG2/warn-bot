import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChannelType,
  Colors,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import VerifyModel from "../../Schemas/VerifyModel";
import { CustomClient } from "../../classes/CustomClient";
import Event from "../../classes/Event";
import { wikiUrl } from "../../config/config.json";

export default class VerifyStart extends Event {
  constructor(client: CustomClient) {
    super(client, { once: false });
  }

  async execute(interaction: ButtonInteraction): Promise<void> {
    if (!interaction.isButton() || !interaction.customId) return;

    if (interaction.customId === "verifyStart") {
      const channel = interaction.channel! as TextChannel;
      await interaction.reply({
        ephemeral: true,
        content: "Caricamento in corso...",
      });

      // Check verify
      const isInVerify = await VerifyModel.findOne({
        userId: interaction.user.id,
      });
      if (isInVerify) {
        const thread = await channel.threads
          .fetch(isInVerify.threadId)
          .catch(() => {});
        if (thread) {
          await interaction.editReply({ content: "Sei già sotto verifica." });
          return;
        } else if (!thread && isInVerify.finished) {
          await interaction.editReply({
            content:
              "Sei già stato verificato. Se vuoi unlinkare l'account Fandom esegui il comando /unlink.",
          });
          return;
        } else await isInVerify.deleteOne();
      }

      // Create thread
      const thread = await channel.threads.create({
        name: `verify-${interaction.user.username}`,
        type: ChannelType.PrivateThread,
        reason: "Inizio processo di verifica",
      });
      await thread.members.add(
        interaction.user,
        "Aggiunto utente al processo di verifica."
      );

      const verifyEmbed = new EmbedBuilder()
        .setColor(Colors.Yellow)
        .setTitle("Verifica")
        .setDescription(
          "Prosegui con il processo di verifica cliccando il bottone qui sotto"
        )
        .setTimestamp()
        .setFooter({
          text: interaction.guild!.name,
          iconURL: interaction.guild?.iconURL()!,
        });

      const redirBtn = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(
          `${wikiUrl}/Speciale:VerifyUser?user=${interaction.user.username}&ch=verify-${interaction.user.username}&c=/link`
        )
        .setLabel("Connetti L'Account Fandom");
      const verifyRow = new ActionRowBuilder<ButtonBuilder>().setComponents(
        redirBtn
      );
      const message = await thread.send({
        embeds: [verifyEmbed],
        components: [verifyRow],
      });

      // Salva db
      const verifyUser = new VerifyModel({
        userId: interaction.user.id,
        channelId: channel.id,
        threadId: thread.id,
        messageId: message.id,
      });
      await verifyUser.save();

      await interaction.editReply({
        content: `Thread di verifica creato con successo. ${thread}.`,
      });
    }
  }
}
