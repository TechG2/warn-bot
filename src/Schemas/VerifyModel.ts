import { Schema, model } from "mongoose";

export interface IVerify {
  userId: string;
  channelId: string;
  threadId: string;
  messageId: string;
  fandomInfo: {
    fandomLinked: boolean;
    info: {
      fandomName: string;
      fandomDiscordId: string;
    };
  };
  finished: boolean;
}

export const VerifySchema = new Schema<IVerify>({
  userId: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  threadId: {
    type: String,
    required: true,
  },
  messageId: {
    type: String,
    required: true,
  },
  fandomInfo: {
    fandomLinked: {
      type: Boolean,
      default: false,
      required: true,
    },
    info: {
      fandomName: {
        type: String,
        required: false,
      },
      fandomDiscordId: {
        type: String,
        required: false,
      },
      fandomUrl: {
        type: String,
        required: false,
      },
    },
  },
  finished: {
    type: Boolean,
    default: false,
    required: true,
  },
});

export default model<IVerify>("verifies", VerifySchema);
