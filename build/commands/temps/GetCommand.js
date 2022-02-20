"use strict";
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
const BaseCommand_1 = __importDefault(require("../../utils/structures/BaseCommand"));
class GetCommand extends BaseCommand_1.default {
    constructor() {
        super("get", "temps", []);
    }
    run(client, message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const embed = new discord_js_1.MessageEmbed()
                .setColor("DARK_BUT_NOT_BLACK")
                .setTitle("الغرف المتاحة");
            const row = new discord_js_1.MessageActionRow();
            const tempChannels = client.temps.channels;
            tempChannels.forEach((temp) => {
                var _a, _b, _c, _d;
                const btn = new discord_js_1.MessageButton()
                    .setStyle("PRIMARY")
                    .setCustomId(temp.channelID)
                    .setLabel((_b = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.get(temp.channelID)) === null || _b === void 0 ? void 0 : _b.name)
                    .setEmoji("⚙");
                row.addComponents(btn);
                const optionsKeys = Object.keys(temp.options), optionsValues = Object.values(temp.options);
                embed.addField(`${(_d = (_c = message.guild) === null || _c === void 0 ? void 0 : _c.channels.cache.get(temp.channelID)) === null || _d === void 0 ? void 0 : _d.name}`, `${temp.children
                    ? temp.children.map((child) => `<#${child.channel.id}>`)
                    : "None"}` +
                    "\n" +
                    `${optionsKeys.map((option, index) => `${option}: ${optionsValues[index]}\n`)}`, false);
            });
            if (row.components && row.components.length > 0)
                message.reply({ embeds: [embed], components: [row] });
            else
                message.reply({ embeds: [embed.setTitle("لا توجد غرف")] });
        });
    }
}
exports.default = GetCommand;
