import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { createWriteStream } from 'fs'
import { extname, resolve } from 'path'
import { pipeline } from 'stream'
import { promisify } from 'util'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (req, res) => {
    console.log('CHEGUEI NA ROTA')

    const oneMBtoBinaryBites = 1048576
    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/

    const file = await req.file({
      limits: {
        fileSize: 5 * oneMBtoBinaryBites, // 5mb
      },
    })

    if (!file) {
      return res.status(400).send({ error: 'File is empty' })
    }

    const isValidFileFormat = mimeTypeRegex.test(file.mimetype)

    if (!isValidFileFormat) {
      return res.status(400).send({ error: 'Invalid file format' })
    }

    const fileId = randomUUID()
    const extension = extname(file.filename)
    const fileName = fileId.concat(extension)

    const writeStream = createWriteStream(
      resolve(__dirname, '../../uploads', fileName)
    )

    await pump(file.file, writeStream)

    const serverBaseUrl = req.protocol.concat('://').concat(req.hostname)
    const fileUrl = new URL(`/uploads/${fileName}`, serverBaseUrl).toString()

    return res.status(200).send({ message: 'OK', fileUrl })
  })
}
