import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "../classes/Command";
import { CustomClient } from "../classes/CustomClient";

export default class Test extends Command {
  constructor(client: CustomClient) {
    super(client, {
      data: new SlashCommandBuilder().setName("test").setDescription("test"),
    });
  }

  execute(interaction: ChatInputCommandInteraction): void {}
}
