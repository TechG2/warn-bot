import {
  ActionRowBuilder,
  ButtonInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { CustomClient } from "../../classes/CustomClient";
import Event from "../../classes/Event";
import { tickets } from "../../config/config.json";

export default class CategoriesList extends Event {
  constructor(client: CustomClient) {
    super(client, {
      once: false,
    });
  }

  async execute(interaction: ButtonInteraction): Promise<void> {
    if (!interaction.isButton() || !interaction.customId) return;

    if (interaction.customId === "openTicket") {
      const categoriesMenu = new StringSelectMenuBuilder()
        .setMinValues(1)
        .setMaxValues(1)
        .setCustomId("ticketOpenCategories")
        .setPlaceholder("Seleziona una categoria supporto.")
        .setOptions(
          tickets.categories.map((category) =>
            new StringSelectMenuOptionBuilder()
              .setValue(category.value)
              .setLabel(category.name)
              .setDescription(category.description)
          )
        );
      const categoriesRow =
        new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
          categoriesMenu
        );

      await interaction.reply({
        ephemeral: true,
        components: [categoriesRow],
      });
    }
  }
}
