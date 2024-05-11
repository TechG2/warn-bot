"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFiles = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
function getFiles(folderPath, folder = false) {
    const foudFiles = node_fs_1.default.readdirSync(folderPath);
    const files = [];
    foudFiles.forEach((file) => {
        const fullPath = node_path_1.default.join(folderPath, file);
        if (folder) {
            if (node_fs_1.default.lstatSync(fullPath).isDirectory())
                files.push(fullPath);
        }
        else {
            if (node_fs_1.default.lstatSync(fullPath).isFile())
                files.push(fullPath);
        }
    });
    return files;
}
exports.getFiles = getFiles;
