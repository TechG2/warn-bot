import { Collection } from "discord.js";
import Command from "../classes/Command";
import { IConfig } from "./IConfig";

export interface ICustomClient {
  loadHandler(): void;

  config: IConfig;
  commands: Collection<string, Command>;
}
