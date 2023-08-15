// command START

import { Message } from 'node-telegram-bot-api'
import { zeroUserCommand } from '../additional.js'
import { bot } from '../bot.js'
import { createNewUser } from '../checking.js'
import { logger } from '../logger.js'
import {
  dbConnection,
  findSuperRootAdmin,
  findUserInTableUsers,
} from '../requestBD.js'
import { saveNewUser } from '../requestBD.js'

export async function keyboardCommandStart(
  msg: Message,
  owner_this_bot: string
) {
  try {
    if (msg.from) {
      const MSG_FROM_ID = msg.from.id
      const MSG_CHAT_ID = msg.chat.id
      const findUser = await findUserInTableUsers(
        MSG_CHAT_ID.toString(),
        dbConnection
      )
      const super_root = await findSuperRootAdmin(dbConnection)
      if (super_root && super_root.length > 0)
        owner_this_bot = `@${super_root[0].username}`
      if (findUser !== undefined) {
        if (findUser.length === 0) {
          const newUser = createNewUser(msg.from, true)
          if (newUser !== undefined) {
            saveNewUser(newUser, dbConnection)
            if (saveNewUser.length > 0) {
              bot.sendMessage(
                MSG_CHAT_ID,
                `Пользователь создан. Для доступа к возможностям бота запросите разрешение у ${owner_this_bot}`
              )
            } else {
              bot.sendMessage(MSG_CHAT_ID, 'Error save BD')
            }
          } else {
            bot.sendMessage(MSG_CHAT_ID, 'Error create new user')
          }
        } else {
          bot.sendMessage(
            MSG_CHAT_ID,
            `Вы уже записаны. Для доступа к возможностям бота запросите разрешение у ${owner_this_bot}`
          )
        }
        zeroUserCommand(MSG_FROM_ID.toString())
      } else {
        bot.sendMessage(MSG_CHAT_ID, 'Error find BD')
      }
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module start.ts function keyboardCommandStart',
      additional: error,
    })
  }
}
