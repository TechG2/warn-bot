import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import TicketModel from "../Schemas/TicketModel";
import Command from "../classes/Command";
import { CustomClient } from "../classes/CustomClient";

export default class Move extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("move")
        .setDescription("Sposta un ticket in un'altra categoria"),
    });
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    // Check ticket
    const ticket = await TicketModel.findOne({
      channelId: interaction.channel!.id,
      isClosed: false,
    });
    if (!ticket) {
      await interaction.reply({
        ephemeral: true,
        content: "Questo canale non è un ticket.",
      });
      return;
    }

    // Check staff
    const member = await interaction.guild!.members.fetch(interaction.user.id);
    const isStaff = member.roles.cache.some((role) =>
      [
        ...this.client.config.staff.staffRoles,
        ...this.client.config.staff.headRoles,
      ].includes(role.id)
    );
    if (!isStaff) {
      await interaction.reply({
        ephemeral: true,
        content: "Non hai i permessi necessari per eseguire questo comando.",
      });
      return;
    }

    // out
    const categoriesMenu = new StringSelectMenuBuilder()
      .setMaxValues(1)
      .setPlaceholder("Scegli una categoria...")
      .setCustomId("ticketMove")
      .setOptions(
        this.client.config.tickets.categories.map((category) =>
          new StringSelectMenuOptionBuilder()
            .setLabel(category.name)
            .setDescription(category.description)
            .setValue(category.value)
        )
      );
    const categoriesRow =
      new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
        categoriesMenu
      );

    await interaction.reply({ ephemeral: true, components: [categoriesRow] });
  }
}
