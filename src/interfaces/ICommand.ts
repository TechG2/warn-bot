import { SlashCommandBuilder } from "discord.js";
import { CustomClient } from "../classes/CustomClient";

export interface ICommand {
  client: CustomClient;
  data: SlashCommandBuilder;
}
