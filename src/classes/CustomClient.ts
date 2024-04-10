import { Client, ClientOptions, Collection } from "discord.js";
import { ICustomClient } from "../interfaces/ICustomClient";
import Command from "./Command";
import Handler from "./Handler";

export class CustomClient extends Client implements ICustomClient {
  handler: Handler;
  commands: Collection<string, Command> = new Collection();

  constructor(options: ClientOptions) {
    super(options);

    this.handler = new Handler(this);
  }

  loadHandler(): void {
    this.handler.loadEvents();
    this.handler.loadCommands();
  }
}
