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
const BaseCommand_1 = __importDefault(require("../../utils/structures/BaseCommand"));
const quick_db_1 = __importDefault(require("quick.db"));
class SetCommand extends BaseCommand_1.default {
    constructor() {
        super("set", "temps", ["temp"]);
    }
    run(client, _message, _args) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            if (!((_a = _message.member) === null || _a === void 0 ? void 0 : _a.voice.channel)) {
                _message.reply({ content: "إنضم لغرفة صوتية أولا" });
                return;
            }
            else {
                if (client.temps.channels.some((channel) => { var _a; return channel.channelID === ((_a = _message.member) === null || _a === void 0 ? void 0 : _a.voice.channelId); })) {
                    _message.channel.send("لديك واحدة بالفعل");
                    return;
                }
                const options = {
                    childCategory: (_c = (_b = _message.guild) === null || _b === void 0 ? void 0 : _b.channels.cache.filter((channel) => {
                        var _a, _b;
                        return channel.type === "GUILD_CATEGORY" &&
                            channel.children.has((_b = (_a = _message.member) === null || _a === void 0 ? void 0 : _a.voice.channel) === null || _b === void 0 ? void 0 : _b.id);
                    }).last()) === null || _c === void 0 ? void 0 : _c.id,
                    childAutoDeleteIfEmpty: true,
                    childAutoDeleteIfOwnerLeaves: true,
                    childMaxUsers: 3,
                    childBitrate: 64000,
                    childFormat: (member, count) => `#${count} | ${member.user.username}'s temp`,
                };
                client.temps.registerChannel((_e = (_d = _message.member) === null || _d === void 0 ? void 0 : _d.voice.channel) === null || _e === void 0 ? void 0 : _e.id, options);
                quick_db_1.default.push("temp-channels", {
                    channelID: (_f = _message.member) === null || _f === void 0 ? void 0 : _f.voice.channelId,
                    options: options,
                });
                _message.channel.send("تم إنشاء الغرفة!");
                (_g = _message.member) === null || _g === void 0 ? void 0 : _g.voice.disconnect("تم تفعيل الغرفة");
            }
        });
    }
}
exports.default = SetCommand;
