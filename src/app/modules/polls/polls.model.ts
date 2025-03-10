import mongoose, { Schema } from 'mongoose'
import { IPoll } from './polls.interface'

const pollSchema = new Schema<IPoll>(
  {
    question: { type: String, required: true },
    options: [
      {
        choice: { type: String, required: true },
        votes: { type: Number, default: 0 },
      },
    ],
    expiresAt: { type: String, required: true },
    hideResults: { type: Boolean, default: false },
    reactions: {
      fire: { type: Number, default: 0 },
      like: { type: Number, default: 0 },
    },
    comments: [
      {
        text: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
)

export default mongoose.model<IPoll>('Poll', pollSchema)
