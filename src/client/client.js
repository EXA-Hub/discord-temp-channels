"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_temp_channels_1 = __importDefault(require("discord-temp-channels"));
class DiscordClient extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this._commands = new discord_js_1.Collection();
        this._events = new discord_js_1.Collection();
        this._temps = new discord_temp_channels_1.default(this);
        this._prefix = "!";
    }
    get temps() {
        return this._temps;
    }
    get commands() {
        return this._commands;
    }
    get events() {
        return this._events;
    }
    get prefix() {
        return this._prefix;
    }
    set prefix(prefix) {
        this._prefix = prefix;
    }
}
exports.default = DiscordClient;
