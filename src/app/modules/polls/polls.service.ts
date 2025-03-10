/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { IPoll } from './polls.interface'
import Poll from './polls.model'

const createPoll = async (payload: IPoll) => {
  const result = await Poll.create(payload)
  const link = `${process.env.FRONTEND_URL_LIVE}/polls/${result._id}`
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
  const result = await Poll.findById(id).select('question options').lean()

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'This Poll is not found')
  }
  const formattedResult = {
    question: result.question,
    options: result.options.map((option) => ({
      choice: option.choice,
      votes: option.votes,
    })),
  }

  return formattedResult
}

const getPollResult = async (id: string) => {
  // Find the poll by ID and select the relevant fields
  const poll = await Poll.findById(id)
    .select('question options expiresAt hideResults')
    .lean()

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

  // Format the result to include question and options with votes
  const formattedResult = {
    question: poll.question,
    options: poll.options.map((option) => ({
      choice: option.choice,
      votes: option.votes,
    })),
  }

  return formattedResult
}

const voteAPoll = async (id: string, optionIndex: number) => {
  // Find the poll by ID
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

  // Increment the votes for the selected option
  poll.options[optionIndex].votes += 1

  // Save the poll with the updated vote count
  const updatedPoll = await poll.save()

  // Return the updated poll
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
  deletePoll,
}
