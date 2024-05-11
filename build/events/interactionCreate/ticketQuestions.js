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
const Event_1 = __importDefault(require("../../classes/Event"));
const config_json_1 = require("../../config/config.json");
class TicketQuestions extends Event_1.default {
    constructor(client) {
        super(client, {
            once: false,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isStringSelectMenu() || !interaction.customId)
                return;
            if (interaction.customId === "ticketOpenCategories") {
                const optionValue = interaction.values[0];
                const category = config_json_1.tickets.categories.find((category) => category.value === optionValue);
                if (!category) {
                    yield interaction.reply({
                        ephemeral: true,
                        content: "C'è stato un errore.",
                    });
                    return;
                }
                // modal
                const ticketModal = new discord_js_1.ModalBuilder()
                    .setTitle("Rispondi")
                    .setCustomId(`openTicketModal-${config_json_1.tickets.categories.indexOf(category)}`);
                // Get questions
                for (const question of category.questions) {
                    const questionInput = new discord_js_1.TextInputBuilder()
                        .setLabel(question.question)
                        .setPlaceholder("Risposta...")
                        .setMaxLength(question.maxLength)
                        .setCustomId(question.id)
                        .setStyle(question.style)
                        .setRequired(question.required);
                    const questionRow = new discord_js_1.ActionRowBuilder().setComponents(questionInput);
                    ticketModal.addComponents(questionRow);
                }
                yield interaction.showModal(ticketModal);
            }
        });
    }
}
exports.default = TicketQuestions;
