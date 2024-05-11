"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("../../classes/Event"));
class Ready extends Event_1.default {
    constructor(client) {
        super(client, {
            once: true,
        });
    }
    execute(client) {
        var _a;
        console.log();
        console.log(`Logged as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
    }
}
exports.default = Ready;
