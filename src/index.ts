import { Hono } from 'hono'
import filesController from './controller/files'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/files', filesController)

export default app
