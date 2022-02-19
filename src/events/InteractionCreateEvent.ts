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
    const { Modal, TextInputComponent, showModal } = require("discord-modals");
    const optionsKeys = Object.keys(channel?.options!),
      optionsValues = Object.values(channel?.options!);
    const modal = new Modal()
      .setCustomId(channel?.channelID)
      .setTitle(interaction.component.label)
      .addComponents(
        optionsKeys.map((key, index) => {
          const q = new TextInputComponent()
            .setValue(optionsValues[index].toString())
            .setStyle("SHORT")
            .setCustomId(key)
            .setLabel(key);
          return q;
        })
      );
    showModal(modal, {
      client: client,
      interaction: interaction,
    });
  }
}
