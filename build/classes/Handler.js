"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const config_json_1 = require("../config/config.json");
const getFiles_1 = require("../functions/getFiles");
dotenv_1.default.config();
class Handler {
    constructor(client) {
        this.client = client;
    }
    loadEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            const eventsDir = (0, getFiles_1.getFiles)(path_1.default.join(__dirname, "..", "events"), true);
            eventsDir.forEach((event) => {
                const eventName = event.split("\\").pop();
                const files = (0, getFiles_1.getFiles)(event);
                files.map((file) => __awaiter(this, void 0, void 0, function* () {
                    const event = new (yield Promise.resolve(`${file}`).then(s => __importStar(require(s)))).default(this.client);
                    const execute = (...args) => event.execute(...args);
                    if (event.once)
                        this.client.once(eventName, execute);
                    else
                        this.client.on(eventName, execute);
                }));
            });
        });
    }
    loadCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = (0, getFiles_1.getFiles)(path_1.default.join(__dirname, "..", "commands"));
            const commands = [];
            console.log("Loaded Commands:");
            for (const file of files) {
                const command = new (yield Promise.resolve(`${file}`).then(s => __importStar(require(s)))).default(this.client);
                console.log(`${command.data.name} ✔️`);
                commands.push(command.data);
                this.client.commands.set(command.data.name, command);
            }
            const rest = new discord_js_1.REST().setToken(process.env.TOKEN);
            try {
                yield rest.put(discord_js_1.Routes.applicationGuildCommands(process.env.CLIENT_ID, config_json_1.guildId), { body: commands });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = Handler;
