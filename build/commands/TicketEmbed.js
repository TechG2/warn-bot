"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../classes/Command"));
const config_json_1 = require("../config/config.json");
class TicketEmbed extends Command_1.default {
    constructor(client) {
        super(client, {
            data: new discord_js_1.SlashCommandBuilder()
                .setName("ticket-embed")
                .setDescription("Invia l'embed per aprire un ticket.")
                .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.Administrator),
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const ticketEmbed = new discord_js_1.EmbedBuilder()
                .setAuthor({
                name: "Backroom Wiki",
                iconURL: (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.iconURL(),
                url: config_json_1.wikiUrl,
            })
                .setColor(discord_js_1.Colors.Blue)
                .setTitle("Apri un Ticket!")
                .setDescription("Premi uno dei bottoni qui sotto per aprire un ticket.")
                .setTimestamp()
                .setFooter({
                text: interaction.guild.name,
            });
            const openBtn = new discord_js_1.ButtonBuilder()
                .setEmoji("🎟️")
                .setLabel("Supporto")
                .setStyle(discord_js_1.ButtonStyle.Secondary)
                .setCustomId("openTicket");
            const appBtn = new discord_js_1.ButtonBuilder()
                .setEmoji("⚒️")
                .setLabel("Staff")
                .setStyle(discord_js_1.ButtonStyle.Secondary)
                .setCustomId("openApp");
            const ticketRow = new discord_js_1.ActionRowBuilder().setComponents(openBtn, appBtn);
            yield ((_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.send({
                embeds: [ticketEmbed],
                components: [ticketRow],
            }));
            yield interaction.reply({
                ephemeral: true,
                content: "Embed inviato con successo.",
            });
        });
    }
}
exports.default = TicketEmbed;
