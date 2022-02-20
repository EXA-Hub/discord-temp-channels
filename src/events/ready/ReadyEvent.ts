import { ParentChannelData } from "discord-temp-channels/lib/types";
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

    client.on("modalSubmit", (modal) => {
      const member: GuildMember = modal.member;
      if (!member.permissions.has("ADMINISTRATOR")) {
        modal.reply("لا يمكنك");
        return;
      } else {
        const channel = client.temps.channels.find(
          (channel) => channel.channelID === modal.customId
        );
        if (!channel) {
          modal.reply("لا يوجد غرفة");
          return;
        } else {
          const data: Array<{
            type: string;
            customId: string;
            value: string;
          }> = modal.fields;
          const childFormat = (member: GuildMember, count: Number) =>
            `#${count} | ${member.user.username}'s temp`;
          const {
            childMaxUsers,
            childAutoDeleteIfEmpty,
            childAutoDeleteIfOwnerLeaves,
            childBitrate,
            childCategory,
          } = channel.options;
          const options = {
            childMaxUsers,
            childAutoDeleteIfEmpty,
            childAutoDeleteIfOwnerLeaves,
            childBitrate,
            childCategory,
            childFormat,
          };
          data.forEach(({ customId, value }) => {
            switch (customId) {
              case "childAutoDeleteIfEmpty":
                options[customId] = value === "false" ? false : true;
                break;
              case "childAutoDeleteIfOwnerLeaves":
                options[customId] = value === "false" ? false : true;
                break;
              case "childMaxUsers":
                if (isNaN(parseInt(value)))
                  options[customId] = parseInt(
                    `${channel.options.childMaxUsers}`
                  );
                else options[customId] = parseInt(value);
                break;
              case "childBitrate":
                if (isNaN(parseInt(value)))
                  options[customId] = parseInt(
                    `${channel.options.childBitrate}`
                  );
                else options[customId] = parseInt(value);
                break;
              case "childCategory":
                if (
                  member.guild.channels.cache.has(value) &&
                  member.guild.channels.cache.get(value)?.type ===
                    "GUILD_CATEGORY"
                )
                  options[customId] = value;
                else options[customId] = `${channel.options.childCategory}`;
                break;
            }
          });
          channel.children.forEach((child) => {
            child.channel.delete();
          });
          client.temps.unregisterChannel(channel.channelID);
          const channels: Array<ParentChannelData> = db.get("temp-channels");
          db.set(
            "temp-channels",
            channels.filter((c) => c.channelID !== channel.channelID)
          );
          client.temps.registerChannel(channel.channelID, options);
          db.push("temp-channels", {
            channelID: channel.channelID,
            options,
          });
          modal.reply(`تم التغيير بنجاح`);
        }
      }
    });

    const tempChannels = client.temps;
    if (!db.get("temp-channels")) db.set("temp-channels", []);
    db.get("temp-channels").forEach((channelData: ParentChannelData) => {
      const childFormat = (member: GuildMember, count: Number) =>
        `#${count} | ${member.user.username}'s temp`;
      const {
        childMaxUsers,
        childAutoDeleteIfEmpty,
        childAutoDeleteIfOwnerLeaves,
        childBitrate,
        childCategory,
      } = channelData.options;
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
