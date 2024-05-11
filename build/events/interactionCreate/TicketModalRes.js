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
const TicketModel_1 = __importDefault(require("../../Schemas/TicketModel"));
const Event_1 = __importDefault(require("../../classes/Event"));
const config_json_1 = require("../../config/config.json");
class TicketModalRes extends Event_1.default {
    constructor(client) {
        super(client, {
            once: false,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!interaction.isModalSubmit() || !interaction.customId)
                return;
            if (interaction.customId.startsWith("openTicketModal-")) {
                yield interaction.reply({
                    ephemeral: true,
                    content: "Ticket in creazione...",
                });
                const categoryIndex = +interaction.customId.replace("openTicketModal-", "");
                const category = config_json_1.tickets.categories[categoryIndex];
                if (!category) {
                    yield interaction.editReply({
                        content: "C'è stato un errore",
                    });
                    return;
                }
                const values = category.questions
                    .map((question) => ({
                    question: question.question,
                    answer: interaction.fields.getTextInputValue(question.id),
                }))
                    .filter((value) => value.answer && value.answer !== "");
                // Check ticket
                const alreadyExist = yield TicketModel_1.default.findOne({
                    authorId: interaction.user.id,
                });
                if (alreadyExist) {
                    const checkTicket = yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.fetch(alreadyExist.channelId).catch(() => { }));
                    if (checkTicket) {
                        yield interaction.editReply({
                            content: `Hai già un ticket aperto, <#${alreadyExist.channelId}>.`,
                        });
                        return;
                    }
                    else
                        yield alreadyExist.deleteOne();
                }
                // Create channel
                const channel = yield interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    topic: `Ticket create da ${interaction.user} sotto la categoria ${category.name}.`,
                    parent: category.categoryId,
                    reason: "Creazione ticket.",
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [
                                discord_js_1.PermissionsBitField.Flags.SendMessages,
                                discord_js_1.PermissionsBitField.Flags.ViewChannel,
                            ],
                        },
                        {
                            id: interaction.user.id,
                            allow: [
                                discord_js_1.PermissionsBitField.Flags.SendMessages,
                                discord_js_1.PermissionsBitField.Flags.ViewChannel,
                            ],
                        },
                        ...config_json_1.staff.headRoles.map((roleId) => ({
                            id: roleId,
                            allow: [
                                discord_js_1.PermissionsBitField.Flags.SendMessages,
                                discord_js_1.PermissionsBitField.Flags.ViewChannel,
                            ],
                        })),
                        ...config_json_1.staff.staffRoles.map((roleId) => ({
                            id: roleId,
                            [category.isHeadOnly ? "deny" : "allow"]: [
                                discord_js_1.PermissionsBitField.Flags.SendMessages,
                                discord_js_1.PermissionsBitField.Flags.ViewChannel,
                            ],
                        })),
                    ],
                });
                // Db
                yield TicketModel_1.default.create({
                    authorId: interaction.user.id,
                    categoryId: category.categoryId,
                    channelId: channel.id,
                    questions: values,
                });
                // Output
                yield interaction.editReply({
                    content: `Ticket creato con successo, ${channel}.`,
                });
                // Send channel
                const ticketEmbed = new discord_js_1.EmbedBuilder()
                    .setColor(discord_js_1.Colors.Blue)
                    .setAuthor({
                    name: "Backroom Wiki",
                    iconURL: (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.iconURL(),
                    url: config_json_1.wikiUrl,
                })
                    .setTitle("Ticket aperto")
                    .setDescription(`${interaction.user}, il tuo ticket è stato aperto con successo. Perfavore attendi risposta da un membro dello staff.`)
                    .setFields({
                    name: "Domande:",
                    value: values
                        .map((question, index) => `${index + 1}. ${question.question}\n\`\`\`${question.answer}\`\`\``)
                        .join("\n"),
                })
                    .setTimestamp()
                    .setFooter({ text: interaction.guild.name });
                yield channel.send(`${interaction.user}, ${category.isHeadOnly
                    ? config_json_1.staff.headRoles.map((roleId) => `<@&${roleId}>`)
                    : config_json_1.staff.staffRoles.map((roleId) => `<@&${roleId}>`)}`);
                const ticketMessage = yield channel.send({
                    embeds: [ticketEmbed],
                });
                ticketMessage.pin();
            }
        });
    }
}
exports.default = TicketModalRes;
