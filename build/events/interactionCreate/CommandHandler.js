"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("../../classes/Event"));
class CommandHandler extends Event_1.default {
    constructor(client) {
        super(client, {
            once: false,
        });
    }
    execute(interaction) {
        if (!interaction.isChatInputCommand())
            return;
        const command = this.client.commands.get(interaction.commandName);
        if (!command)
            return;
        command.execute(interaction, this.client);
    }
}
exports.default = CommandHandler;
