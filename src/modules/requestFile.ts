import 'dotenv/config'
import * as fs from 'node:fs'
import * as path from 'path'
import { mkdir } from 'node:fs/promises'
import { writeFile } from 'node:fs/promises'
import { access, constants } from 'node:fs/promises'
import { fileURLToPath } from 'url'
import { IConfigOptions } from '../global.js'
import { logger } from './logger.js'

interface IWord {
  id: string
  word: string
}

// поиск по файлу, если есть его имя
export function findFileDictionary(file_name: string, path_dictionary: string) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  let pathFile = path.join(__dirname, '../')
  let result: IWord[] | undefined
  try {
    if (path_dictionary.length > 0)
      pathFile = path.join(pathFile, path_dictionary)
    const listFiles = fs.readdirSync(pathFile)
    if (listFiles) {
      listFiles.forEach((file) => {
        if (file.slice(0, file.length - 5) === file_name) {
          const data = fs.readFileSync(
            path.join(pathFile, `${file_name}.json`),
            { encoding: 'utf-8' }
          )
          result = JSON.parse(data)
        }
      })
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestFile.ts function findFileDictionary',
      additional: error,
    })
  }
  return result
}

// поиск конфигурационного файла
export function findConfig() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  let pathFile = path.join(__dirname, '../', 'conf')
  let result: IConfigOptions | undefined
  try {
    const listFiles = fs.readdirSync(pathFile)
    if (listFiles) {
      listFiles.forEach((file) => {
        if (file.slice(0, file.length - 5) === 'config') {
          const data = fs.readFileSync(path.join(pathFile, `config.json`), {
            encoding: 'utf-8',
          })
          result = JSON.parse(data)
        }
      })
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestFile.ts function findConfig',
      additional: error,
    })
  }
  return result
}

// сохранение конфигурационного фала
export async function saveConfig(data: IConfigOptions) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  let pathFile = path.join(__dirname, '../', 'conf')
  try {
    try {
      await access(pathFile, constants.R_OK | constants.W_OK)
    } catch {
      await mkdir(pathFile)
    }

    try {
      await access(
        path.join(pathFile, 'config.json'),
        constants.R_OK | constants.W_OK
      )
    } catch {
      await writeFile(
        path.join(pathFile, 'config.json'),
        JSON.stringify(data),
        { encoding: 'utf-8' }
      )
    }

    return true
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestFile.ts function saveConfig',
      additional: error,
    })
  }
}

// сохранение конфигурационного фала
export async function createLogDir() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  let pathFile = path.join(__dirname, '../', 'Log')
  try {
    try {
      await access(pathFile, constants.R_OK | constants.W_OK)
    } catch {
      await mkdir(pathFile)
    }

    return pathFile
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestFile.ts function createLogDir',
      additional: error,
    })
  }
}
