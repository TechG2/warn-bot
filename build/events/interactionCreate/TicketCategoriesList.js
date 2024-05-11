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
class CategoriesList extends Event_1.default {
    constructor(client) {
        super(client, {
            once: false,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isButton() || !interaction.customId)
                return;
            if (interaction.customId === "openTicket") {
                const categoriesMenu = new discord_js_1.StringSelectMenuBuilder()
                    .setMinValues(1)
                    .setMaxValues(1)
                    .setCustomId("ticketOpenCategories")
                    .setPlaceholder("Seleziona una categoria supporto.")
                    .setOptions(config_json_1.tickets.categories.map((category) => new discord_js_1.StringSelectMenuOptionBuilder()
                    .setValue(category.value)
                    .setLabel(category.name)
                    .setDescription(category.description)));
                const categoriesRow = new discord_js_1.ActionRowBuilder().setComponents(categoriesMenu);
                yield interaction.reply({
                    ephemeral: true,
                    components: [categoriesRow],
                });
            }
        });
    }
}
exports.default = CategoriesList;
