import { TextChannel } from "discord.js";
import { ITicket } from "../Schemas/TicketModel";

export default async function createTranscript(
  channel: TextChannel,
  options?: { limit?: number; ticket?: ITicket }
): Promise<{ buffer: Buffer; text: string }> {
  // def limit
  if (!options) options = {};
  if (!options.limit) options.limit = 100;

  // get msg
  const messages = (await channel.messages.fetch({ limit: options.limit }))
    .map((message) => message)
    .filter((message) => message.content !== "" && message.content);

  let typescript = `[Inizio Transcript]\n\n${messages
    .map(
      (message) =>
        `[${message.createdAt.toLocaleDateString("it", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}] ${message.author.username}: ${message.content}`
    )
    .reverse()
    .join("\n")}\n\n[Fine Transcript]`;

  return { buffer: Buffer.from(typescript, "utf-8"), text: typescript };
}
