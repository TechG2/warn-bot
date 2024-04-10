import { CustomClient } from "../../classes/CustomClient";
import Event from "../../classes/Event";

export default class Ready extends Event {
  constructor(client: CustomClient) {
    super(client, {
      once: true,
    });
  }

  execute(client: CustomClient): void {
    console.log();
    console.log(`Logged as ${client.user?.tag}`);
  }
}
