import { Interaction } from "discord.js";
import { CustomClient } from "../../classes/CustomClient";
import Event from "../../classes/Event";

export default class CommandHandler extends Event {
  constructor(client: CustomClient) {
    super(client, {
      once: false,
    });
  }

  execute(interaction: Interaction): void {
    if (!interaction.isChatInputCommand()) return;

    const command = this.client.commands.get(interaction.commandName);
    if (!command) return;

    command.execute(interaction, this.client);
  }
}
