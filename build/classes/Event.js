"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Event {
    constructor(client, options) {
        this.client = client;
        this.once = options.once;
    }
    execute(...args) { }
}
exports.default = Event;
