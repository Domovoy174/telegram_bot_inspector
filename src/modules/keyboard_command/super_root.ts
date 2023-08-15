import { Message } from 'node-telegram-bot-api'
import { ICallback_query } from '../../global.js'
import { menuChats } from '../../menu/menuChats.js'
import { zeroUserCommand } from '../additional.js'
import { bot } from '../bot.js'
import { createNewUser } from '../checking.js'
import { logger } from '../logger.js'
import {
  updateUserToSuperRoot,
  findUserInTableUsers,
  saveNewUser,
  dbConnection,
} from '../requestBD.js'

export async function keyboardCommandSuperRoot(msg: Message) {
  try {
    if (msg.from) {
      const MSG_FROM_ID = msg.from.id
      const findUser = await findUserInTableUsers(
        msg.chat.id.toString(),
        dbConnection
      )
      if (findUser !== undefined) {
        if (findUser.length === 0) {
          const newUser = createNewUser(msg.from, true, true)
          if (newUser !== undefined) {
            saveNewUser(newUser, dbConnection)
            if (saveNewUser.length > 0) {
              bot.sendMessage(msg.chat.id, 'Пользователь создан')
            } else {
              bot.sendMessage(msg.chat.id, 'Error save BD')
            }
          } else {
            bot.sendMessage(msg.chat.id, 'Error create new user')
          }
        } else {
          const save_super_root = await updateUserToSuperRoot(
            MSG_FROM_ID.toString(),
            false,
            true,
            dbConnection
          )
          if (save_super_root) {
            bot.sendMessage(msg.chat.id, 'Вы теперь SUPER ROOT ADMIN')
          } else {
            bot.sendMessage(msg.chat.id, 'Ошибка записи в БД')
          }
        }
        zeroUserCommand(msg.from.id.toString())
        setTimeout(() => {
          const data_query: ICallback_query = {
            u: MSG_FROM_ID.toString(),
            c: 'MENU',
          }
          bot.sendMessage(msg.chat.id, ' _____ Главное меню _____ ', {
            reply_markup: menuChats(data_query),
          })
        }, 1000)
      } else {
        bot.sendMessage(msg.chat.id, 'Error find BD')
      }
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module super_root.ts function keyboardCommandSuperRoot',
      additional: error,
    })
  }
}
