import { Client, ClientOptions, Collection } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import BaseCommand from "../utils/structures/BaseCommand";
import TempChannels from "discord-temp-channels";

export default class DiscordClient extends Client {
  private _commands = new Collection<string, BaseCommand>();
  private _events = new Collection<string, BaseEvent>();
  private _temps: TempChannels = new TempChannels(this);
  private _prefix: string = "!";

  constructor(options: ClientOptions) {
    super(options);
  }

  get temps(): TempChannels {
    return this._temps;
  }

  get commands(): Collection<string, BaseCommand> {
    return this._commands;
  }
  get events(): Collection<string, BaseEvent> {
    return this._events;
  }
  get prefix(): string {
    return this._prefix;
  }

  set prefix(prefix: string) {
    this._prefix = prefix;
  }
}
