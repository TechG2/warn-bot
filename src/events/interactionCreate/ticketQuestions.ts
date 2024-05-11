import {
  ActionRowBuilder,
  ModalBuilder,
  StringSelectMenuInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { CustomClient } from "../../classes/CustomClient";
import Event from "../../classes/Event";
import { tickets } from "../../config/config.json";

export default class TicketQuestions extends Event {
  constructor(client: CustomClient) {
    super(client, {
      once: false,
    });
  }

  async execute(interaction: StringSelectMenuInteraction): Promise<void> {
    if (!interaction.isStringSelectMenu() || !interaction.customId) return;

    if (interaction.customId === "ticketOpenCategories") {
      const optionValue = interaction.values[0];
      const category = tickets.categories.find(
        (category) => category.value === optionValue
      );
      if (!category) {
        await interaction.reply({
          ephemeral: true,
          content: "C'è stato un errore.",
        });
        return;
      }

      // modal
      const ticketModal = new ModalBuilder()
        .setTitle("Rispondi")
        .setCustomId(`openTicketModal-${tickets.categories.indexOf(category)}`);

      // Get questions
      for (const question of category.questions) {
        const questionInput = new TextInputBuilder()
          .setLabel(question.question)
          .setPlaceholder("Risposta...")
          .setMaxLength(question.maxLength)
          .setCustomId(question.id)
          .setStyle(question.style)
          .setRequired(question.required);
        const questionRow =
          new ActionRowBuilder<TextInputBuilder>().setComponents(questionInput);

        ticketModal.addComponents(questionRow);
      }

      await interaction.showModal(ticketModal);
    }
  }
}
