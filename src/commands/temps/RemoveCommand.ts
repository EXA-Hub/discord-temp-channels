import { ParentChannelData } from "discord-temp-channels/lib/types";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { Message } from "discord.js";
import db from "quick.db";

export default class RemoveCommand extends BaseCommand {
  constructor() {
    super("remove", "temps", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const channelID = args[0];
    if (!channelID) {
      message.react("❌");
      return;
    } else {
      const channel = client.temps.channels.find(
        (channel) => channel.channelID === channelID
      );
      if (!channel) {
        message.react("❌");
        return;
      } else {
        client.temps.unregisterChannel(channelID);
        const channels: Array<ParentChannelData> = db.get("temp-channels");
        db.set(
          "temp-channels",
          channels.filter((c) => c.channelID !== channel.channelID)
        );
        message.reply({ content: `تم حذف الغرفة: <#${channelID}>` });
      }
    }
  }
}
