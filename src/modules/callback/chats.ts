import TelegramBot from 'node-telegram-bot-api'
import {
  COMMAND_ADD_CHAT,
  DELETE_THIS_CHAT,
  ICallback_query,
} from '../../global.js'
import { listChats } from '../../menu/button.js'
import { menuChats } from '../../menu/menuChats.js'
import { createList, createListWithCommand } from '../additional.js'
import { bot } from '../bot.js'
import { logger } from '../logger.js'
import {
  editCommandForUser,
  deleteChatFromRootAdmin,
  deleteRulesFromChat,
  dbConnection,
} from '../requestBD.js'

export async function menuAddChats(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      bot.editMessageText(
        'Проверьте, что бы этот бот был администратором в чате и перешлите следующее сообщение c цифрами в чат',
        {
          chat_id: query.message.chat.id,
          message_id: query.message.message_id,
        }
      )
      const toDay = Number(new Date())
      const editAdmin = await editCommandForUser(
        userId,
        { command: COMMAND_ADD_CHAT, command_value: `${toDay}` },
        dbConnection
      )

      setTimeout(() => {
        if (query.message) bot.sendMessage(query.message.chat.id, `${toDay}`)
      }, 1000)
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module chats.ts function menuAddChats',
      additional: error,
    })
  }
}

export async function menuDeleteChats(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      bot.editMessageText(' _____ Список чатов _____ ', {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
        reply_markup: listChats(createListWithCommand(chats, DELETE_THIS_CHAT)),
      })
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module chats.ts function menuDeleteChats',
      additional: error,
    })
  }
}

export async function commandListingChats(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      bot.editMessageText(' _____ Список чатов _____ ', {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
        reply_markup: listChats(createList(chats)),
      })
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module chats.ts function commandListingChats',
      additional: error,
    })
  }
}

export async function deleteChat(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      const delChat = await deleteChatFromRootAdmin(info, userId, dbConnection)
      if (delChat) bot.sendMessage(userId, `Удалено ${delChat} записей чата`)
      const delRules = await deleteRulesFromChat(info, dbConnection)
      if (delRules)
        bot.sendMessage(userId, `Удалено ${delRules} записей правил чата`)
      setTimeout(() => {
        const data_query: ICallback_query = {
          u: userId,
        }
        bot.sendMessage(userId, ' _____ Главное меню _____ ', {
          reply_markup: menuChats(data_query),
        })
      }, 2000)
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module chats.ts function  deleteChat',
      additional: error,
    })
  }
  if (query.data && query.from && query.message) {
    const delChat = await deleteChatFromRootAdmin(info, userId, dbConnection)
    if (delChat) bot.sendMessage(userId, `Удалено ${delChat} записей чата`)
    const delRules = await deleteRulesFromChat(info, dbConnection)
    if (delRules)
      bot.sendMessage(userId, `Удалено ${delRules} записей правил чата`)
    setTimeout(() => {
      const data_query: ICallback_query = {
        u: userId,
      }
      bot.sendMessage(userId, ' _____ Главное меню _____ ', {
        reply_markup: menuChats(data_query),
      })
    }, 2000)
  }
}
