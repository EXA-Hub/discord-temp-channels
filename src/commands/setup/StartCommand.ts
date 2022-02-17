import { GuildMember, Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import TempChannels from "discord-temp-channels";
import DiscordClient from "../../client/client";
import { ParentChannelOptions } from "discord-temp-channels/lib/types";
import db from "quick.db";

export default class StartCommand extends BaseCommand {
  constructor() {
    super("start", "setup", []);
  }

  async run(client: DiscordClient, _message: Message, _args: Array<string>) {
    _message.reply({ content: "جار بدأ التشغيل" });
    const tempChannels = new TempChannels(client);
    if (!db.get("temp-channels")) db.set("temp-channels", []);
    db.get("temp-channels").forEach(
      (channelData: {
        channelID: string;
        options: ParentChannelOptions | undefined;
      }) =>
        tempChannels.registerChannel(channelData.channelID, channelData.options)
    );
    client.on("messageCreate", (message: Message) => {
      if (message.content.startsWith(client.prefix + "set")) {
        if (
          tempChannels.channels.some(
            (channel) => channel.channelID === message.member?.voice.channelId
          )
        )
          message.channel.send("لديك واحدة بالفعل");
        const options = {
          childAutoDeleteIfEmpty: true,
          childAutoDeleteIfOwnerLeaves: true,
          childMaxUsers: 3,
          childBitrate: 64000,
          childFormat: (member: GuildMember, count: Number) =>
            `#${count} | ${member.user.username}'s lounge`,
        };
        tempChannels.registerChannel(
          message.member?.voice.channel?.id!,
          options
        );
        db.push("temp-channels", {
          channelID: message.member?.voice.channelId,
          options: options,
        });
        message.channel.send("تم إنشاء الغرفة!");
      }
    });
  }
}
