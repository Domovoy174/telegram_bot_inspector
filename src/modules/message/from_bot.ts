import { Message } from 'node-telegram-bot-api'
import { bot_id } from '../../index.js'
import { createNewChat } from '../checking.js'
import { COMMAND_ADD_CHAT, ICallback_query, IUser } from '../../global.js'

import {
  findUserInTableUsers,
  findOneChat,
  saveChat,
  createRulesForChat,
  dbConnection,
} from '../requestBD.js'
import { menuChats } from '../../menu/menuChats.js'
import { zeroUserCommand } from '../additional.js'
import { bot } from '../bot.js'
import { logger } from '../logger.js'

export async function formBot(msg: Message) {
  try {
    // если сообщение в чате было переправлено от этого бота
    if (msg.from && msg.forward_from && msg.forward_from.id === bot_id) {
      const user: IUser | undefined = await findUserInTableUsers(
        msg.from.id.toString(),
        dbConnection
      )
      if (user !== undefined) {
        const myChat = await findOneChat(
          user.admin_id,
          msg.chat.id.toString(),
          dbConnection
        )
        if (
          user.command === COMMAND_ADD_CHAT &&
          user.command_value === msg.text
        ) {
          if (myChat.length === 0) {
            const newChat = createNewChat(user, msg.chat)
            if (newChat) {
              const saveDataChat = await saveChat(newChat, dbConnection)
              // создаём правила и выключаем все
              const newRules = createRulesForChat(
                msg.chat.id.toString(),
                {
                  created_at: new Date(),
                  updated_at: new Date(),
                  chat_id: msg.chat.id.toString(),
                  link_delete: false,
                  personalDB_dictionary: false,
                  generalDB_dictionary: false,
                  generalFile_dictionary: false,
                  user_block: false,
                  notify_admin: false,
                },
                dbConnection
              )
              if (saveDataChat) {
                bot.sendMessage(msg.from.id, 'Данные записаны в БД')
                setTimeout(() => {
                  if (msg.from && msg.from.id) {
                    const data_query: ICallback_query = {
                      u: msg.from.id.toString(),
                      c: 'MENU',
                    }
                    bot.sendMessage(msg.from.id, '<- Главное меню ->', {
                      reply_markup: menuChats(data_query),
                    })
                    zeroUserCommand(msg.from.id.toString())
                  }
                }, 1500)
              } else {
                bot.sendMessage(msg.from.id, 'Ошибка записаны в БД')
              }
            } else {
              bot.sendMessage(msg.from.id, 'Ошибка распознания сообщения')
            }
            zeroUserCommand(user.admin_id)
          } else {
            bot.sendMessage(msg.from.id, 'Данные уже есть в БД')
          }
          bot.deleteMessage(msg.chat.id, msg.message_id)
        }
      }
      return true
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module from_bot.ts function formBot',
      additional: error,
    })
  }
}

export async function formBotZeroMessage(msg: Message) {
  try {
    if (msg.from && msg.from.id === bot_id && !msg.text) {
      bot.deleteMessage(msg.chat.id, msg.message_id)
      return true
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module from_bot.ts function formBotZeroMessage',
      additional: error,
    })
  }
}
