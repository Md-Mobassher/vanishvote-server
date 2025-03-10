import express from 'express'
import { PollsControllers } from './polls.controller'
import {
  commentPollSchema,
  createPollsValidationSchema,
  reactPollSchema,
  votePollValidationSchema,
} from './polls.validation'
import validateRequest from '../../middlewares/validateRequest'

const router = express.Router()

router.post(
  '/',
  validateRequest(createPollsValidationSchema),
  PollsControllers.createPoll,
)

router.get('/', PollsControllers.getAllPoll)

router.get('/:id', PollsControllers.getSinglePoll)

router.get('/:id/results', PollsControllers.getPollResults)

router.post(
  '/:id/vote',
  validateRequest(votePollValidationSchema),
  PollsControllers.voteAPoll,
)

router.post(
  '/:id/react',
  validateRequest(reactPollSchema),
  PollsControllers.reactAPoll,
)

router.post(
  '/:id/comment',
  validateRequest(commentPollSchema),
  PollsControllers.commentAPoll,
)

router.delete('/:id', PollsControllers.deletePoll)

export const PollsRoutes = router
