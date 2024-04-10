import {
  ActionRowBuilder,
  ButtonInteraction,
  Colors,
  EmbedBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  StringSelectMenuOptionBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { CustomClient } from "../../classes/CustomClient";
import Event from "../../classes/Event";

export default class MenuWarn extends Event {
  constructor(client: CustomClient) {
    super(client, {
      once: false,
    });
  }

  async execute(
    interaction: ButtonInteraction | StringSelectMenuInteraction
  ): Promise<void> {
    if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;

    if (interaction.customId.startsWith("banMenu-") && interaction.isButton()) {
      const banUserId: string = interaction.customId.replace("banMenu-", "");

      const banEmbed = new EmbedBuilder()
        .setColor(Colors.DarkRed)
        .setTitle("Sanziona l'utente")
        .setThumbnail(interaction.user.displayAvatarURL())
        .setDescription(
          "Scegli una delle opzioni qui sotto per sanzionare l'utente."
        )
        .setTimestamp()
        .setFooter({
          text: interaction.guild!.name,
          iconURL: interaction.guild?.iconURL()!,
        });

      const banMenu = new StringSelectMenuBuilder()
        .setMaxValues(1)
        .setMinValues(1)
        .setCustomId(`banMenuSend-${banUserId}`)
        .setOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("Ban")
            .setDescription("Banna l'utente.")
            .setValue("ban"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Mute")
            .setDescription("Muta l'utente.")
            .setValue("mute"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Warn")
            .setDescription("Warna l'utente.")
            .setValue("warn")
        );
      const banRow =
        new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(banMenu);

      await interaction.reply({
        ephemeral: true,
        embeds: [banEmbed],
        components: [banRow],
      });
    } else if (
      interaction.customId.startsWith("banMenuSend-") &&
      interaction.isStringSelectMenu()
    ) {
      const banUserId: string = interaction.customId.replace(
        "banMenuSend-",
        ""
      );
      const type = interaction.values[0];

      const timeInput = new TextInputBuilder()
        .setLabel("Time")
        .setMaxLength(50)
        .setCustomId("timeInput")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("ex. 1h, 1w, 5d");
      const reasonInput = new TextInputBuilder()
        .setLabel("Reason")
        .setMaxLength(150)
        .setCustomId("reasonInput")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("ex. Tossicità");

      const timeRow = new ActionRowBuilder<TextInputBuilder>().setComponents(
        timeInput
      );
      const reasonRow = new ActionRowBuilder<TextInputBuilder>().setComponents(
        reasonInput
      );

      const banModal = new ModalBuilder().setComponents(timeRow, reasonRow);
      if (type === "ban") {
        banModal.setTitle("Ban");
        banModal.setCustomId(`ban-${banUserId}`);
      } else if (type === "mute") {
        banModal.setTitle("Mute");
        banModal.setCustomId(`mute-${banUserId}`);
      } else {
        banModal.setTitle("Warn");
        banModal.setCustomId(`warn-${banUserId}`);
      }

      await interaction.showModal(banModal);
    }
  }
}
