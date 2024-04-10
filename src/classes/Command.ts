import { SlashCommandBuilder } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { ICommandOptions } from "../interfaces/ICommandOptions";
import { CustomClient } from "./CustomClient";

export default class Command implements ICommand {
  client: CustomClient;
  data: SlashCommandBuilder;

  constructor(client: CustomClient, options: ICommandOptions) {
    this.client = client;
    this.data = options.data;
  }

  execute(...args: any): void {}
}
