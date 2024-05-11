import dotenv from "dotenv";
import { connect } from "mongoose";
import { CustomClient } from "../../classes/CustomClient";
import Event from "../../classes/Event";
dotenv.config();

export default class Mongo extends Event {
  constructor(client: CustomClient) {
    super(client, {
      once: false,
    });
  }

  execute(): void {
    connect(process.env.MONGO_DB!)
      .then(() => console.log("Connected with the DB"))
      .catch(console.log);
  }
}
