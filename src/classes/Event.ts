import { IEvent } from "../interfaces/IEvent";
import { IEventOptions } from "../interfaces/IEventOptions";
import { CustomClient } from "./CustomClient";

export default class Event implements IEvent {
  client: CustomClient;
  once: boolean;

  constructor(client: CustomClient, options: IEventOptions) {
    this.client = client;
    this.once = options.once;
  }

  execute(...args: any): void {}
}
