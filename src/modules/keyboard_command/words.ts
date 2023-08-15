import { Message } from 'node-telegram-bot-api'
import { menuChooseBD } from '../../menu/menuChooseBD.js'
import { ICallback_query, IUser, NULL } from '../../global.js'
import { dbConnection, findUserInTableUsers } from '../requestBD.js'
import { bot } from '../bot.js'
import { logger } from '../logger.js'

export async function keyboardCommandWords(msg: Message) {
  try {
    if (msg.from) {
      const user: IUser | undefined = await findUserInTableUsers(
        msg.from.id.toString(),
        dbConnection
      )
      if (user !== undefined && (user.super_root_admin || user.root_admin)) {
        const data_query: ICallback_query = {
          u: msg.from.id.toString(),
          d: NULL,
        }
        bot.sendMessage(
          msg.chat.id,
          ' _____ Выберите с какой базой нужно работать _____ ',
          {
            reply_markup: menuChooseBD(data_query),
          }
        )
      }
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module words.ts function keyboardCommandWords',
      additional: error,
    })
  }
}
