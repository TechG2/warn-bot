import { Collection } from "discord.js";
import Command from "../classes/Command";

export interface ICustomClient {
  loadHandler(): void;

  commands: Collection<string, Command>;
}
