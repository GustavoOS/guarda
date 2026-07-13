import { Hono } from 'hono'
import { logger } from 'hono/logger'
import filesController from './controllers/files.route'

const app = new Hono().use(logger())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/files', filesController)

export default app
