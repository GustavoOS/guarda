import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import filesController from './controllers/files.route'
import webhooksController from './controllers/webhooks.route'
import { cache } from './infra/cache'
import { getIpv4Ips, getPublicIp } from './infra/connectivity/network'

console.log(getIpv4Ips());
const publicIp = await getPublicIp();
if(!publicIp) {
  throw new Error('Failed to retrieve public IP address');
}
cache.set('publicIp', publicIp);
const app = new Hono().use(logger()).use(cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/files', filesController)
app.route('/webhooks', webhooksController)

export default app
