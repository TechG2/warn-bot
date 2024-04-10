import { REST, Routes, SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
import path from "path";
import { getFiles } from "../functions/getFiles";
import { IHandler } from "../interfaces/IHandler";
import Command from "./Command";
import { CustomClient } from "./CustomClient";
import Event from "./Event";

dotenv.config();

export default class Handler implements IHandler {
  client: CustomClient;

  constructor(client: CustomClient) {
    this.client = client;
  }

  async loadEvents(): Promise<void> {
    const eventsDir = getFiles(path.join(__dirname, "..", "events"), true);

    eventsDir.forEach((event: string) => {
      const eventName: string = event.split("\\").pop()!;
      const files = getFiles(event);

      files.map(async (file: string) => {
        const event: Event = new (await import(file)).default(this.client);
        const execute = (...args: any) => event.execute(...args);

        if (event.once) this.client.once(eventName, execute);
        else this.client.on(eventName, execute);
      });
    });
  }

  async loadCommands(): Promise<void> {
    const files = getFiles(path.join(__dirname, "..", "commands"));
    const commands: SlashCommandBuilder[] = [];

    console.log("Loaded Commands:");
    for (const file of files) {
      const command: Command = new (await import(file)).default(this.client);
      console.log(`${command.data.name} ✔️`);

      commands.push(command.data);
      this.client.commands.set(command.data.name, command);
    }

    const rest = new REST().setToken(process.env.TOKEN!);

    try {
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID!,
          "1160957400573038632"
        ),
        { body: commands }
      );
    } catch (error) {
      console.log(error);
    }
  }
}
