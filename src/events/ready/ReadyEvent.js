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
const BaseEvent_1 = __importDefault(require("../../utils/structures/BaseEvent"));
const quick_db_1 = __importDefault(require("quick.db"));
class ReadyEvent extends BaseEvent_1.default {
    constructor() {
        super("ready");
    }
    run(client) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log(((_a = client.user) === null || _a === void 0 ? void 0 : _a.tag) + " has logged in.");
            client.on("modalSubmit", (modal) => {
                const member = modal.member;
                if (!member.permissions.has("ADMINISTRATOR")) {
                    modal.reply("لا يمكنك");
                    return;
                }
                else {
                    const channel = client.temps.channels.find((channel) => channel.channelID === modal.customId);
                    if (!channel) {
                        modal.reply("لا يوجد غرفة");
                        return;
                    }
                    else {
                        const data = modal.fields;
                        const childFormat = (member, count) => `#${count} | ${member.user.username}'s temp`;
                        const { childMaxUsers, childAutoDeleteIfEmpty, childAutoDeleteIfOwnerLeaves, childBitrate, childCategory, } = channel.options;
                        const options = {
                            childMaxUsers,
                            childAutoDeleteIfEmpty,
                            childAutoDeleteIfOwnerLeaves,
                            childBitrate,
                            childCategory,
                            childFormat,
                        };
                        data.forEach(({ customId, value }) => {
                            var _a;
                            switch (customId) {
                                case "childAutoDeleteIfEmpty":
                                    options[customId] = value === "false" ? false : true;
                                    break;
                                case "childAutoDeleteIfOwnerLeaves":
                                    options[customId] = value === "false" ? false : true;
                                    break;
                                case "childMaxUsers":
                                    if (isNaN(parseInt(value)))
                                        options[customId] = parseInt(`${channel.options.childMaxUsers}`);
                                    else
                                        options[customId] = parseInt(value);
                                    break;
                                case "childBitrate":
                                    if (isNaN(parseInt(value)))
                                        options[customId] = parseInt(`${channel.options.childBitrate}`);
                                    else
                                        options[customId] = parseInt(value);
                                    break;
                                case "childCategory":
                                    if (member.guild.channels.cache.has(value) &&
                                        ((_a = member.guild.channels.cache.get(value)) === null || _a === void 0 ? void 0 : _a.type) ===
                                            "GUILD_CATEGORY")
                                        options[customId] = value;
                                    else
                                        options[customId] = `${channel.options.childCategory}`;
                                    break;
                            }
                        });
                        channel.children.forEach((child) => {
                            child.channel.delete();
                        });
                        client.temps.unregisterChannel(channel.channelID);
                        const channels = quick_db_1.default.get("temp-channels");
                        quick_db_1.default.set("temp-channels", channels.filter((c) => c.channelID !== channel.channelID));
                        client.temps.registerChannel(channel.channelID, options);
                        quick_db_1.default.push("temp-channels", {
                            channelID: channel.channelID,
                            options,
                        });
                        modal.reply(`تم التغيير بنجاح`);
                    }
                }
            });
            const tempChannels = client.temps;
            if (!quick_db_1.default.get("temp-channels"))
                quick_db_1.default.set("temp-channels", []);
            quick_db_1.default.get("temp-channels").forEach((channelData) => {
                const childFormat = (member, count) => `#${count} | ${member.user.username}'s temp`;
                const { childMaxUsers, childAutoDeleteIfEmpty, childAutoDeleteIfOwnerLeaves, childBitrate, childCategory, } = channelData.options;
                tempChannels.registerChannel(channelData.channelID, {
                    childMaxUsers,
                    childAutoDeleteIfEmpty,
                    childAutoDeleteIfOwnerLeaves,
                    childBitrate,
                    childCategory,
                    childFormat,
                });
            });
            // Emitted when a child channel is created
            tempChannels.on("childCreate", (member, channel, parentChannel) => {
                console.log(member.user.tag + " The member who created the new channel");
                console.log(channel.name + " The channel which was created");
                console.log(parentChannel.name +
                    " The channel the member joined to create the new channel");
            });
            // Emitted when a child channel is deleted
            tempChannels.on("childDelete", (member, channel, parentChannel) => {
                console.log(member.user.tag + " The member who caused the deletion of the channel");
                console.log(channel.name + " The channel which was deleted");
                console.log(parentChannel.name +
                    " The channel the member joined to create the deleted channel");
            });
            // Emitted when a channels is registered
            tempChannels.on("channelRegister", (channelData) => console.log(channelData));
            // Emitted when a channels is unregistered
            tempChannels.on("channelUnregister", (channelData) => console.log(channelData));
            // Emitted when there is an error
            tempChannels.on("error", (err, message) => {
                console.log(err);
                console.log(message);
            });
        });
    }
}
exports.default = ReadyEvent;
