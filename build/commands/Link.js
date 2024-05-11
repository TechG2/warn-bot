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
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const discord_js_1 = require("discord.js");
const VerifyModel_1 = __importDefault(require("../Schemas/VerifyModel"));
const Command_1 = __importDefault(require("../classes/Command"));
const config_json_1 = require("../config/config.json");
class Link extends Command_1.default {
    constructor(client) {
        super(client, {
            data: new discord_js_1.SlashCommandBuilder()
                .setName("link")
                .setDescription("Linka il tuo accound discord con quello fandom.")
                .addStringOption((option) => option
                .setName("fandom-name")
                .setDescription("Il tuo nome utente Fandom.")
                .setRequired(true)),
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get options
            const fandomName = interaction.options.getString("fandom-name");
            // Check user
            const toVerifyUser = yield VerifyModel_1.default.findOne({
                userId: interaction.user.id,
                finished: false,
            });
            if (!toVerifyUser) {
                interaction.reply({
                    ephemeral: true,
                    content: "C'è stato un errore",
                });
                return;
            }
            // getUser
            const { data } = yield axios_1.default.get(`${config_json_1.wikiUrl}/Users:${fandomName}`);
            const $ = cheerio_1.default.load(data);
            const text = $(".user-identity-social__icon-tooltip.wds-dropdown__content").text();
            console.log(text);
        });
    }
}
exports.default = Link;
