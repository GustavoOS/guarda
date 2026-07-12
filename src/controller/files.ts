import { Hono } from 'hono'
import { sValidator } from '@hono/standard-validator'
import z from 'zod'

const createFileSchema = z.object({
    filename: z.string().min(1, { message: 'File name is required' }).max(255, { message: 'File name must be less than 255 characters' }),
})
const filesController = new Hono()
    .post('/upload', sValidator('json', createFileSchema), (c) => {
        const data = c.req.valid('json')
        return c.json({ message: `File ${data.filename} uploaded successfully` })
    })

export default filesController
