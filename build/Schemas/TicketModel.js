"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketSchema = void 0;
const mongoose_1 = require("mongoose");
exports.TicketSchema = new mongoose_1.Schema({
    authorId: {
        type: String,
        required: true,
    },
    categoryId: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
    },
    openedDate: {
        type: Date,
        default: new Date(),
        required: true,
    },
    questions: [
        {
            question: {
                type: String,
                required: true,
            },
            answer: {
                type: String,
                required: true,
            },
        },
    ],
    isClosed: {
        type: Boolean,
        default: false,
        required: true,
    },
    closeInfo: {
        by: {
            type: String,
            required: false,
        },
        at: {
            type: Date,
            required: false,
        },
    },
    isClaimed: {
        type: Boolean,
        default: false,
        required: true,
    },
    claimInfo: {
        by: {
            type: String,
            required: false,
        },
        at: {
            type: Date,
            required: false,
        },
    },
});
exports.default = (0, mongoose_1.model)("tickets", exports.TicketSchema);
