import { GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { CustomClient } from "./classes/CustomClient";

dotenv.config();
const client = new CustomClient({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

client.loadHandler();
client.login(process.env.TOKEN);
