import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import filesController from './controllers/files.route'
import webhooksController from './controllers/webhooks.route'

const app = new Hono().use(logger()).use(cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/files', filesController)
app.route('/webhooks', webhooksController)

export default app
