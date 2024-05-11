import { Client, ClientOptions, Collection } from "discord.js";
import config from "../config/config.json";
import { IConfig } from "../interfaces/IConfig";
import { ICustomClient } from "../interfaces/ICustomClient";
import Command from "./Command";
import Handler from "./Handler";

export class CustomClient extends Client implements ICustomClient {
  handler: Handler;
  commands: Collection<string, Command> = new Collection();
  config: IConfig = config;

  constructor(options: ClientOptions) {
    super(options);

    this.handler = new Handler(this);
  }
  initBackend(): void {
    throw new Error("Method not implemented.");
  }

  loadHandler(): void {
    this.handler.loadEvents();
    this.handler.loadCommands();
  }
}
