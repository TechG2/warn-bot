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
const VerifyModel_1 = __importDefault(require("../../Schemas/VerifyModel"));
const Event_1 = __importDefault(require("../../classes/Event"));
const config_json_1 = require("../../config/config.json");
class VerifyStart extends Event_1.default {
    constructor(client) {
        super(client, { once: false });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!interaction.isButton() || !interaction.customId)
                return;
            if (interaction.customId === "verifyStart") {
                const channel = interaction.channel;
                yield interaction.reply({
                    ephemeral: true,
                    content: "Caricamento in corso...",
                });
                // Check verify
                const isInVerify = yield VerifyModel_1.default.findOne({
                    userId: interaction.user.id,
                    finished: false,
                });
                if (isInVerify) {
                    const thread = yield channel.threads
                        .fetch(isInVerify.threadId)
                        .catch(() => { });
                    if (thread) {
                        yield interaction.editReply({ content: "Sei già sotto verifica." });
                        return;
                    }
                    else
                        yield isInVerify.deleteOne();
                }
                // Create thread
                const thread = yield channel.threads.create({
                    name: `verify-${interaction.user.username}`,
                    type: discord_js_1.ChannelType.PrivateThread,
                    reason: "Inizio processo di verifica",
                });
                yield thread.members.add(interaction.user, "Aggiunto utente al processo di verifica.");
                const verifyEmbed = new discord_js_1.EmbedBuilder()
                    .setColor(discord_js_1.Colors.Yellow)
                    .setTitle("Verifica")
                    .setDescription("Prosegui con il processo di verifica cliccando il bottone qui sotto")
                    .setTimestamp()
                    .setFooter({
                    text: interaction.guild.name,
                    iconURL: (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.iconURL(),
                });
                const redirBtn = new discord_js_1.ButtonBuilder()
                    .setStyle(discord_js_1.ButtonStyle.Link)
                    .setURL(`${config_json_1.wikiUrl}/Speciale:VerifyUser?user=${interaction.user.username}&ch=verify-${interaction.user.username}&c=/link`)
                    .setLabel("Connetti L'Account Fandom");
                const verifyRow = new discord_js_1.ActionRowBuilder().setComponents(redirBtn);
                yield thread.send({ embeds: [verifyEmbed], components: [verifyRow] });
                // Salva db
                const verifyUser = new VerifyModel_1.default({
                    userId: interaction.user.id,
                    channelId: channel.id,
                    threadId: thread.id,
                });
                yield verifyUser.save();
                yield interaction.editReply({
                    content: `Thread di verifica creato con successo. ${thread}.`,
                });
            }
        });
    }
}
exports.default = VerifyStart;
