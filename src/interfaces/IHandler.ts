import { CustomClient } from "../classes/CustomClient";

export interface IHandler {
  client: CustomClient;

  loadEvents(): void;
}
