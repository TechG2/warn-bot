import { CustomClient } from "../classes/CustomClient";

export interface IEvent {
  client: CustomClient;
  once: boolean;
}
