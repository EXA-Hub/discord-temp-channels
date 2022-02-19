import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { Message } from "discord.js";

export default class TestCommand extends BaseCommand {
  constructor() {
    super("test", "testing", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    message.channel.send(
      "مرحبا أنا أعمل\n" +
        `
    \x32\x20\x60\x78\x6e\x7a\x9c\x89
    \u00E9\u0065\u0301
    \0 The NUL character (\u0000)
    \b Backspace (\u0008)
    \t Horizontal tab (\u0009)
    \n Newline (\u000A)
    \v Vertical tab (\u000B)
    \f Form feed (\u000C)
    \r Carriage return (\u000D)
    \" Double quote (\u0022)
    \' Apostrophe or single quote (\u0027)
    \\ Backslash (\u005C)
     `
    );
  }
}
