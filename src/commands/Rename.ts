import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import TicketModel from "../Schemas/TicketModel";
import Command from "../classes/Command";
import { CustomClient } from "../classes/CustomClient";

export default class Rename extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("rename")
        .setDescription("Rinomina un ticket.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Il nuovo nome del canale.")
            .setRequired(true)
        ),
    });
  }

  async execute(
    interaction: ChatInputCommandInteraction
  ): Promise<Promise<void>> {
    // Options
    const newName = interaction.options.getString("name")!;
    let oldName;

    // Check ticket
    const isTicket = await TicketModel.findOne({
      channelId: interaction.channel!.id,
      isClosed: false,
    });
    if (!isTicket) {
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

    // Channel rename
    const channel = interaction.channel! as TextChannel;
    oldName = channel.name;
    await channel.setName(newName, "Cambio nome di un ticket.");

    // Output
    await interaction.reply({
      ephemeral: true,
      content: `Nome del ticket cambiato da **${oldName}** a **${channel.name}**.`,
    });
  }
}
