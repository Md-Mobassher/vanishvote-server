import { Document } from 'mongoose'

export interface IOption {
  choice: string
  votes: number
}

export interface IComment {
  text: string
  createdAt: Date
}

export interface IPoll extends Document {
  question: string
  options: IOption[]
  expiresAt: string
  hideResults: boolean
  createdAt: Date
  reactions: {
    fire: number
    like: number
  }
  comments: IComment[]
}
