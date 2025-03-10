import { Router } from 'express'
import { PollsRoutes } from '../modules/polls/polls.routes'

const router = Router()

const moduleRoutes = [
  {
    path: '/polls',
    route: PollsRoutes,
  },
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router
