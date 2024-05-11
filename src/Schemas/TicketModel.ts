import { Schema, model } from "mongoose";

export interface ITicket {
  id: number;
  authorId: string;
  categoryId: string;
  channelId: string;
  categoryType: number;
  openedDate: Date;
  userAdded: {
    users: string[];
  };
  questions: {
    question: string;
    answer: string;
  }[];

  isClosed: boolean;
  closeInfo: { by: string; at: Date } | null;

  isClaimed: boolean;
  claimInfo: { by: string; at: Date } | null;

  trascript: Buffer;
}

export const TicketSchema = new Schema<ITicket>({
  authorId: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  categoryType: {
    type: Number,
    required: true,
  },
  openedDate: {
    type: Date,
    default: new Date(),
    required: true,
  },
  userAdded: {
    users: {
      type: [String],
      default: [],
      required: true,
    },
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
    },
  ],

  isClosed: {
    type: Boolean,
    default: false,
    required: true,
  },
  closeInfo: {
    by: {
      type: String,
      required: false,
    },
    at: {
      type: Date,
      required: false,
    },
  },

  isClaimed: {
    type: Boolean,
    default: false,
    required: true,
  },
  claimInfo: {
    by: {
      type: String,
      required: false,
    },
    at: {
      type: Date,
      required: false,
    },
  },

  trascript: {
    type: Buffer,
    required: false,
  },
});

export default model<ITicket>("tickets", TicketSchema);
