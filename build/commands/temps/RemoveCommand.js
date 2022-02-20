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
class RemoveCommand extends BaseCommand_1.default {
    constructor() {
        super("remove", "temps", []);
    }
    run(client, message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const channelID = args[0];
            if (!channelID) {
                message.react("❌");
                return;
            }
            else {
                const channel = client.temps.channels.find((channel) => channel.channelID === channelID);
                if (!channel) {
                    message.react("❌");
                    return;
                }
                else {
                    client.temps.unregisterChannel(channelID);
                    const channels = quick_db_1.default.get("temp-channels");
                    quick_db_1.default.set("temp-channels", channels.filter((c) => c.channelID !== channel.channelID));
                    message.reply({ content: `تم حذف الغرفة: <#${channelID}>` });
                }
            }
        });
    }
}
exports.default = RemoveCommand;
