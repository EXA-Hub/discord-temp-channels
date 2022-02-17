import BaseCommand from "../../utils/structures/BaseCommand";
import { Message, GuildMember } from "discord.js";
import DiscordClient from "../../client/client";
import db from "quick.db";

export default class SetCommand extends BaseCommand {
  constructor() {
    super("set", "temps", ["temp"]);
  }

  async run(client: DiscordClient, _message: Message, _args: Array<string>) {
    const tempChannels = client.temps;
    if (
      tempChannels.channels.some(
        (channel) => channel.channelID === _message.member?.voice.channelId
      )
    ) {
      _message.channel.send("لديك واحدة بالفعل");
      return;
    }
    const options = {
      childAutoDeleteIfEmpty: true,
      childAutoDeleteIfOwnerLeaves: true,
      childMaxUsers: 3,
      childBitrate: 64000,
      childFormat: (member: GuildMember, count: Number) =>
        `#${count} | ${member.user.username}'s lounge`,
    };
    tempChannels.registerChannel(_message.member?.voice.channel?.id!, options);
    db.push("temp-channels", {
      channelID: _message.member?.voice.channelId,
      options: options,
    });
    _message.channel.send("تم إنشاء الغرفة!");
  }
}
