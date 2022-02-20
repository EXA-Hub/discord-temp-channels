import {
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class GetCommand extends BaseCommand {
  constructor() {
    super("get", "temps", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const embed = new MessageEmbed()
      .setColor("DARK_BUT_NOT_BLACK")
      .setTitle("الغرف المتاحة");
    const row = new MessageActionRow();
    const tempChannels = client.temps.channels;
    tempChannels.forEach((temp) => {
      const btn = new MessageButton()
        .setStyle("PRIMARY")
        .setCustomId(temp.channelID)
        .setLabel(message.guild?.channels.cache.get(temp.channelID)?.name!)
        .setEmoji("⚙");
      row.addComponents(btn);
      const optionsKeys = Object.keys(temp.options),
        optionsValues = Object.values(temp.options);
      embed.addField(
        `${message.guild?.channels.cache.get(temp.channelID)?.name}`,
        `${
          temp.children
            ? temp.children.map((child) => `<#${child.channel.id}>`)
            : "None"
        }` +
          "\n" +
          `${optionsKeys.map(
            (option, index) => `${option}: ${optionsValues[index]}\n`
          )}`,
        false
      );
    });
    if (row.components && row.components.length > 0)
      message.reply({ embeds: [embed], components: [row] });
    else message.reply({ embeds: [embed.setTitle("لا توجد غرف")] });
  }
}
