import { Message } from 'node-telegram-bot-api'
import { listChats } from '../../menu/button.js'
import { COMMAND_DEL_ROOT_ADMIN, IUser } from '../../global.js'
import {
  dbConnection,
  findUserInTableUsers,
  findUsersRootAdmin,
} from '../requestBD.js'
import { createAdminList } from '../additional.js'
import { bot } from '../bot.js'
import { logger } from '../logger.js'

export async function keyboardCommandDeleteRootAdmin(msg: Message) {
  try {
    if (msg.from) {
      const user: IUser | undefined = await findUserInTableUsers(
        msg.from.id.toString(),
        dbConnection
      )
      if (user !== undefined && user.super_root_admin) {
        const arrAdmins = await findUsersRootAdmin(dbConnection)
        bot.sendMessage(
          msg.chat.id,
          ' <- Выберите у кого удалить права root admin ->',
          {
            reply_markup: listChats(
              createAdminList(arrAdmins, 'NULL', COMMAND_DEL_ROOT_ADMIN)
            ),
          }
        )
      }
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message:
        'module del_root_admin.ts function keyboardCommandDeleteRootAdmin',
      additional: error,
    })
  }
}
