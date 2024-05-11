"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(client, options) {
        this.client = client;
        this.data = options.data;
    }
    execute(...args) { }
}
exports.default = Command;
