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
const BaseEvent_1 = __importDefault(require("../utils/structures/BaseEvent"));
class InteractionCreateEvent extends BaseEvent_1.default {
    constructor() {
        super("interactionCreate");
    }
    run(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isButton())
                return;
            const channel = client.temps.channels.find((channel) => channel.channelID === interaction.customId);
            if (!channel) {
                interaction.reply({ content: "لا يوجد غرفة بهذا الإسم" });
                return;
            }
            else {
                const options = channel === null || channel === void 0 ? void 0 : channel.options;
                const optionsKeys = Object.keys(options), optionsValues = Object.values(options), { Modal, TextInputComponent, showModal } = require("discord-modals");
                const components = optionsKeys
                    .map((key, index) => {
                    if (key === "childFormat")
                        return "childFormat";
                    const q = new TextInputComponent()
                        .setValue(optionsValues[index].toString())
                        .setStyle("SHORT")
                        .setCustomId(key)
                        .setLabel(key);
                    return q;
                })
                    .filter((key) => key !== "childFormat");
                const modal = new Modal()
                    .setCustomId(channel === null || channel === void 0 ? void 0 : channel.channelID)
                    .setTitle(interaction.component.label)
                    .addComponents(components);
                showModal(modal, {
                    client: client,
                    interaction: interaction,
                });
            }
        });
    }
}
exports.default = InteractionCreateEvent;
