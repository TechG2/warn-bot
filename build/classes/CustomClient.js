"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomClient = void 0;
const discord_js_1 = require("discord.js");
const Handler_1 = __importDefault(require("./Handler"));
class CustomClient extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.commands = new discord_js_1.Collection();
        this.handler = new Handler_1.default(this);
    }
    initBackend() {
        throw new Error("Method not implemented.");
    }
    loadHandler() {
        this.handler.loadEvents();
        this.handler.loadCommands();
    }
}
exports.CustomClient = CustomClient;
