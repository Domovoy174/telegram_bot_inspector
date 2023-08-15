/* Команды для настройки бота

start - Запуск
command_menu - Главное меню
request_root - Запрос на добавление в root
choose_root_admin - Выбрать админа
del_root_admin - Удалить права root
words - Редактирование слов

*/

import 'dotenv/config'
import { IConfigOptions } from './global.js'
import { findConfig, saveConfig } from './modules/requestFile.js'
import { logger } from './modules/logger.js'

const host = process.env.HOST_DB
const port = process.env.PORT_DB
const user = process.env.USER_DB
const database = process.env.DATABASE_NAME
const password = process.env.PASSWORD_DB
const token = process.env.TOKEN
export const secret = process.env.SECRET || 'secret'
export const bot_id = Number(token?.split(':')[0])

export const path_dictionary = process.env.PATH_DICTIONARY
  ? process.env.PATH_DICTIONARY
  : ''
export const filename_dictionary = process.env.FILENAME_DICTIONARY
  ? process.env.FILENAME_DICTIONARY
  : 'generalWords'
export const owner_this_bot = process.env.LOGIN_OWNER
  ? process.env.LOGIN_OWNER
  : 'undefine'

export let configOptions: IConfigOptions | undefined = findConfig()

await createConfigFile()

const requestBD = import('./modules/requestBD.js')
const bot = import('./modules/bot.js')

requestBD
  .then((result) => {
    const checkingTables = result.checkingTables
    const dbConnection = result.dbConnection
    const checkDB = checkingTables(dbConnection)
    checkDB.then((res) => {
      console.log(`DB access = ${res}`)
      logger.info({
        date: new Date(),
        message: 'import module BD',
        additional: `DB access = ${res}`,
      })
    })
  })
  .catch((err: Error) => {
    logger.error({
      date: new Date(),
      message: 'import module BD',
      additional: err,
    })
  })

bot
  .then((res: any) => {
    if (res.bot.token) console.log(`bot start, token: ${res.bot.token}`)
    logger.info({
      date: new Date(),
      message: 'import module bot',
      additional: `bot start, token: ${res.bot.token}`,
    })
  })
  .catch((err: Error) => {
    logger.error({
      date: new Date(),
      message: 'import module bot',
      additional: err,
    })
  })

async function createConfigFile() {
  if (configOptions === undefined) {
    // выход с кодом 1, если нет необходимых входных данных
    if (
      !host ||
      !port ||
      !user ||
      !database ||
      !password ||
      !token ||
      !path_dictionary ||
      !filename_dictionary
    ) {
      logger.error({
        date: new Date(),
        message: 'Not env options',
      })
      process.exit(1)
    } else {
      configOptions = {
        host,
        port,
        user,
        database,
        password,
        token,
        path_dictionary,
        filename_dictionary,
        secret,
        bot_id,
        owner_this_bot,
      }
      const conf = await saveConfig(configOptions)
      logger.info({
        date: new Date(),
        message: `File config.json saving = ${conf}`,
      })
    }
  }
}

console.log('Start = OK')
