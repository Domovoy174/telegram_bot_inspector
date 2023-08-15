import { Message } from 'node-telegram-bot-api'
import { menuChats } from '../../menu/menuChats.js'
import { ICallback_query, IUser } from '../../global.js'
import { dbConnection, findUserInTableUsers } from '../requestBD.js'
import { zeroUserCommand } from '../additional.js'
import { bot } from '../bot.js'
import { logger } from '../logger.js'

export async function keyboardCommandGeneralMenu(msg: Message) {
  try {
    if (msg.from) {
      const user: IUser | undefined = await findUserInTableUsers(
        msg.from.id.toString(),
        dbConnection
      )
      if (user !== undefined && (user.root_admin || user.super_root_admin)) {
        const data_query: ICallback_query = {
          u: msg.from.id.toString(),
          c: 'MENU',
        }
        bot.sendMessage(msg.chat.id, '<- Главное меню ->', {
          reply_markup: menuChats(data_query),
        })
        zeroUserCommand(msg.from.id.toString())
      }
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module general_menu.ts function keyboardCommandGeneralMenu',
      additional: error,
    })
  }
}
