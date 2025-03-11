/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { IComment, IPoll } from './polls.interface'
import Poll from './polls.model'

const createPoll = async (payload: IPoll) => {
  const result = await Poll.create(payload)
  const link = `https://vanishvote-frontend-tau.vercel.app/polls/${result._id}`
  return {
    data: result,
    link: link,
  }
}

const getAllPoll = async () => {
  const result = await Poll.find()
  return result
}

const getSinglePoll = async (id: string) => {
  const result = await Poll.findById(id)

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'This Poll is not found')
  }

  return result
}

const getPollResult = async (id: string) => {
  // Find the poll by ID and select the relevant fields
  const poll = await Poll.findById(id)

  if (!poll) {
    throw new AppError(httpStatus.NOT_FOUND, 'This Poll is not found')
  }

  // Helper function to parse the expiresAt string (e.g., "12h", "1d")
  const parseExpirationTime = (expiresAt: string) => {
    const match = expiresAt.match(/^(\d+)(h|d)$/)
    if (!match) throw new Error('Invalid expiration format')

    const value = parseInt(match[1], 10)
    const unit = match[2]

    const now = new Date()
    if (unit === 'h') {
      now.setHours(now.getHours() + value) // Add hours
    } else if (unit === 'd') {
      now.setDate(now.getDate() + value) // Add days
    }
    return now
  }

  // Calculate the expiration date based on the expiresAt value
  const expirationDate = parseExpirationTime(poll.expiresAt)

  // Check if the poll is expired
  const isExpired = new Date() > expirationDate

  // If the poll has results hidden and it hasn't expired, throw an error
  if (poll.hideResults && !isExpired) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Results are hidden until the poll expires',
    )
  }

  return poll
}

const voteAPoll = async (id: string, optionIndex: number) => {
  const poll = await Poll.findById(id)
  if (!poll) {
    throw new AppError(httpStatus.NOT_FOUND, 'Poll not found')
  }

  // Check if the poll has expired
  if (new Date() > new Date(poll.expiresAt)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This poll has expired')
  }

  // Ensure the option index is valid
  if (optionIndex < 0 || optionIndex >= poll.options.length) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid option index')
  }

  poll.options[optionIndex].votes += 1

  const updatedPoll = await poll.save()

  return updatedPoll
}

const reactAPoll = async (id: string, reaction: string) => {
  const poll = await Poll.findById(id)
  if (!poll) {
    throw new AppError(httpStatus.NOT_FOUND, 'Poll not found')
  }

  if (reaction === '🔥') {
    poll.reactions.fire += 1
  } else if (reaction === '👍') {
    poll.reactions.like += 1
  }

  const updatedPoll = await poll.save()

  return updatedPoll
}

const commentAPoll = async (id: string, text: string) => {
  const poll = await Poll.findById(id)
  if (!poll) {
    throw new AppError(httpStatus.NOT_FOUND, 'Poll not found')
  }
  const newComment: IComment = {
    text: text,
    createdAt: new Date(), // Use Date as expected
  }

  // Add the comment to the poll
  poll.comments.push(newComment)

  const updatedPoll = await poll.save()

  return updatedPoll
}

const deletePoll = async (id: string) => {
  const isPollsExist = await Poll.findById(id)
  if (!isPollsExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This Polls is not found')
  }
  await Poll.findByIdAndDelete(id)
  return null
}

export const PollsServices = {
  createPoll,
  getAllPoll,
  getSinglePoll,
  getPollResult,
  voteAPoll,
  reactAPoll,
  commentAPoll,
  deletePoll,
}
