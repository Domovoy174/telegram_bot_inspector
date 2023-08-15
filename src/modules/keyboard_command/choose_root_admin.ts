import { Message } from 'node-telegram-bot-api'
import { listChats } from '../../menu/button.js'
import { COMMAND_ADD_ROOT_ADMIN, IUser } from '../../global.js'
import {
  dbConnection,
  findUserInTableUsers,
  findUsersWithCommandStart,
} from '../requestBD.js'
import { createAdminList } from '../additional.js'
import { bot } from '../bot.js'
import { logger } from '../logger.js'

export async function keyboardCommandChooseRootAdmin(msg: Message) {
  try {
    if (msg.from) {
      const user: IUser | undefined = await findUserInTableUsers(
        msg.from.id.toString(),
        dbConnection
      )
      if (user !== undefined && user.super_root_admin) {
        const arrAdmins = await findUsersWithCommandStart(dbConnection)
        bot.sendMessage(
          msg.chat.id,
          '<- Запросы на добавление в root admin ->',
          {
            reply_markup: listChats(
              createAdminList(arrAdmins, 'NULL', COMMAND_ADD_ROOT_ADMIN)
            ),
          }
        )
      }
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message:
        'module choose_root_admin.ts function keyboardCommandChooseRootAdmin',
      additional: error,
    })
  }
}
