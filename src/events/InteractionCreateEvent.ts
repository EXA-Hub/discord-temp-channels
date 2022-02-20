import { Interaction, MessageButton } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";

export default class InteractionCreateEvent extends BaseEvent {
  constructor() {
    super("interactionCreate");
  }

  async run(client: DiscordClient, interaction: Interaction) {
    if (!interaction.isButton()) return;
    const channel = client.temps.channels.find(
      (channel) => channel.channelID === interaction.customId
    );
    if (!channel) {
      interaction.reply({ content: "لا يوجد غرفة بهذا الإسم" });
      return;
    } else {
      const options = channel?.options!;
      const optionsKeys = Object.keys(options),
        optionsValues = Object.values(options),
        { Modal, TextInputComponent, showModal } = require("discord-modals");
      const components = optionsKeys
        .map((key, index) => {
          if (key === "childFormat") return "childFormat";
          const q = new TextInputComponent()
            .setValue(optionsValues[index].toString())
            .setStyle("SHORT")
            .setCustomId(key)
            .setLabel(key);
          return q;
        })
        .filter((key) => key !== "childFormat");
      const modal = new Modal()
        .setCustomId(channel?.channelID)
        .setTitle(interaction.component.label)
        .addComponents(components);
      showModal(modal, {
        client: client,
        interaction: interaction,
      });
    }
  }
}
