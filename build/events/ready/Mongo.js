"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = require("mongoose");
const Event_1 = __importDefault(require("../../classes/Event"));
dotenv_1.default.config();
class Mongo extends Event_1.default {
    constructor(client) {
        super(client, {
            once: false,
        });
    }
    execute() {
        (0, mongoose_1.connect)(process.env.MONGO_DB)
            .then(() => console.log("Connected with the DB"))
            .catch(console.log);
    }
}
exports.default = Mongo;
