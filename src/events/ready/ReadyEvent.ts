import {
  ParentChannelData,
  ParentChannelOptions,
} from "discord-temp-channels/lib/types";
import BaseEvent from "../../utils/structures/BaseEvent";
import { GuildMember, VoiceChannel } from "discord.js";
import DiscordClient from "../../client/client";
import db from "quick.db";

export default class ReadyEvent extends BaseEvent {
  constructor() {
    super("ready");
  }
  async run(client: DiscordClient) {
    console.log(client.user?.tag + " has logged in.");

    const tempChannels = client.temps;
    if (!db.get("temp-channels")) db.set("temp-channels", []);
    db.get("temp-channels").forEach(
      (channelData: {
        channelID: string;
        options: ParentChannelOptions | undefined;
      }) =>
        tempChannels.registerChannel(channelData.channelID, channelData.options)
    );

    // Emitted when a child channel is created
    tempChannels.on(
      "childCreate",
      (
        member: GuildMember,
        channel: VoiceChannel,
        parentChannel: VoiceChannel
      ) => {
        console.log(
          member.user.tag + " The member who created the new channel"
        );
        console.log(channel.name + " The channel which was created");
        console.log(
          parentChannel.name +
            " The channel the member joined to create the new channel"
        );
      }
    );

    // Emitted when a child channel is deleted
    tempChannels.on(
      "childDelete",
      (
        member: GuildMember,
        channel: VoiceChannel,
        parentChannel: VoiceChannel
      ) => {
        console.log(
          member.user.tag + " The member who caused the deletion of the channel"
        );
        console.log(channel.name + " The channel which was deleted");
        console.log(
          parentChannel.name +
            " The channel the member joined to create the deleted channel"
        );
      }
    );

    // Emitted when a channels is registered
    tempChannels.on("channelRegister", (channelData: ParentChannelData) =>
      console.log(channelData)
    );

    // Emitted when a channels is unregistered
    tempChannels.on("channelUnregister", (channelData: ParentChannelData) =>
      console.log(channelData)
    );

    // Emitted when there is an error
    tempChannels.on("error", (err: Error, message: String) => {
      console.log(err);
      console.log(message);
    });
  }
}
