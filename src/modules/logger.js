import winston from 'winston'
import { createLogDir } from './requestFile.js'
import * as path from 'path'

const pathFile = await createLogDir()

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.join(pathFile, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(pathFile, 'combined.log'),
    }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  )
}
