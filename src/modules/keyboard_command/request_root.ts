import { Message } from 'node-telegram-bot-api'
import { IUser } from '../../global.js'
import { bot } from '../bot.js'
import { logger } from '../logger.js'
import {
  updateUserToRootAdmin,
  findUserInTableUsers,
  dbConnection,
} from '../requestBD.js'

export async function keyboardCommandRequestRoot(msg: Message) {
  try {
    if (msg.from) {
      const user: IUser | undefined = await findUserInTableUsers(
        msg.from.id.toString(),
        dbConnection
      )
      if (user !== undefined) {
        const requestRoot = await updateUserToRootAdmin(
          msg.from.id.toString(),
          true,
          false,
          dbConnection
        )

        if (requestRoot === 1) {
          bot.sendMessage(msg.chat.id, 'Запрос создан')
        } else {
          bot.sendMessage(msg.chat.id, 'Ошибка БД')
        }
      }
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module request_root.ts function keyboardCommandRequestRoot',
      additional: error,
    })
  }
}
