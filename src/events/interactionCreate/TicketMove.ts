import {
  Colors,
  EmbedBuilder,
  StringSelectMenuInteraction,
  TextChannel,
} from "discord.js";
import TicketModel from "../../Schemas/TicketModel";
import { CustomClient } from "../../classes/CustomClient";
import Event from "../../classes/Event";

export default class TicketMove extends Event {
  constructor(client: CustomClient) {
    super(client, {
      once: false,
    });
  }

  async execute(interaction: StringSelectMenuInteraction): Promise<void> {
    if (!interaction.isStringSelectMenu() || !interaction.customId) return;

    if (interaction.customId === "ticketMove") {
      // category
      const categoryValue = interaction.values[0]!;
      const category = this.client.config.tickets.categories.find(
        (category) => category.value === categoryValue
      )!;

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
      const member = await interaction.guild!.members.fetch(
        interaction.user.id
      );
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

      // Move channel
      const channel = interaction.channel! as TextChannel;
      await channel.setParent(category.categoryId, {
        lockPermissions: false,
        reason: "Cambio categoria.",
      });

      // Update db
      await TicketModel.updateOne(
        { _id: ticket._id },
        { $set: { categoryType: category.type } }
      );

      // Output
      const moveEmbed = new EmbedBuilder()
        .setColor(Colors.DarkOrange)
        .setTitle("Ticket Spostato")
        .setDescription(
          `<@${ticket.authorId}>, il tuo ticket è stato spostato nella categoria **${category.name}**.`
        )
        .setTimestamp();

      await interaction.update({
        content: `Il ticket è stato spostato.`,
        components: [],
      });
      await channel.send({
        embeds: [moveEmbed],
      });
    }
  }
}
