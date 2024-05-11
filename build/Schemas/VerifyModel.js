"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifySchema = void 0;
const mongoose_1 = require("mongoose");
exports.VerifySchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
    },
    threadId: {
        type: String,
        required: true,
    },
    fandomInfo: {
        fandomLinked: {
            type: Boolean,
            default: false,
            required: true,
        },
        fandomSkipped: {
            type: Boolean,
            default: false,
            required: true,
        },
    },
    verified: {
        type: Boolean,
        default: false,
        required: true,
    },
    finished: {
        type: Boolean,
        default: false,
        required: true,
    },
});
exports.default = (0, mongoose_1.model)("verifies", exports.VerifySchema);
