import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { PollsServices } from './polls.service'

const createPoll = catchAsync(async (req, res) => {
  const result = await PollsServices.createPoll(req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Polls is created succesfully',
    data: result.data,
    link: result.link,
  })
})

const getAllPoll = catchAsync(async (req, res) => {
  const result = await PollsServices.getAllPoll()

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Polls are retrieved succesfully',
    data: result,
  })
})

const getSinglePoll = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await PollsServices.getSinglePoll(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Polls is retrieved succesfully',
    data: result,
  })
})

const getPollResults = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await PollsServices.getPollResult(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Poll results is retrieved succesfully',
    data: result,
  })
})

const voteAPoll = catchAsync(async (req, res) => {
  const { id } = req.params
  const { optionIndex } = req.body
  const result = await PollsServices.voteAPoll(id, optionIndex)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Poll results is retrieved succesfully',
    data: result,
  })
})

const deletePoll = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await PollsServices.deletePoll(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Polls is deleted succesfully',
    data: result,
  })
})

export const PollsControllers = {
  createPoll,
  getAllPoll,
  getSinglePoll,
  getPollResults,
  voteAPoll,
  deletePoll,
}
