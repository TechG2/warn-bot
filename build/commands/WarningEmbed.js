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
class WarningEmbed extends Command_1.default {
    constructor(client) {
        super(client, {
            data: new discord_js_1.SlashCommandBuilder()
                .setName("warning-embed")
                .setDescription("Invia l'embed d'avviso dello stato WIP del server.")
                .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.Administrator),
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const warningEmbed = new discord_js_1.EmbedBuilder()
                .setColor(discord_js_1.Colors.Blue)
                .setAuthor({
                iconURL: (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.iconURL(),
                name: "Backroom Wiki",
                url: config_json_1.wikiUrl,
            })
                .setTitle("Manutenzione!")
                .setDescription("Il server è al momento in manutenzione.")
                .setTimestamp()
                .setFooter({
                text: interaction.guild.name,
            });
            yield ((_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.send({
                embeds: [warningEmbed],
            }));
            yield interaction.reply({
                ephemeral: true,
                content: "Embed inviato con successo.",
            });
        });
    }
}
exports.default = WarningEmbed;
