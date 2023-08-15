import {
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove,
  ForceReply,
} from 'node-telegram-bot-api'
import {
  COMMAND_LISTING_ADMINS,
  COMMAND_LISTING_CHATS,
  COMMAND_LISTING_RULES,
  ICallback_query,
  MENU_ADD_ADMIN,
  MENU_ADD_CHAT,
  MENU_DELETE_CHAT,
  MENU_DEL_ADMIN,
  MENU_RULES,
} from '../global.js'
import { button } from './button.js'

export const menuChats = (data_query: ICallback_query) => {
  let textListChats: ICallback_query = {}
  let textListAdmin: ICallback_query = {}
  let textListRules: ICallback_query = {}
  let textAddChats: ICallback_query = {}
  let textDelChats: ICallback_query = {}
  let textAddAdmin: ICallback_query = {}
  let textDelAdmin: ICallback_query = {}
  let textRules: ICallback_query = {}

  Object.assign(textListChats, data_query)
  Object.assign(textListAdmin, data_query)
  Object.assign(textListRules, data_query)
  Object.assign(textAddChats, data_query)
  Object.assign(textDelChats, data_query)
  Object.assign(textAddAdmin, data_query)
  Object.assign(textDelAdmin, data_query)
  Object.assign(textRules, data_query)

  textListChats.c = COMMAND_LISTING_CHATS
  textListAdmin.c = COMMAND_LISTING_ADMINS
  textListRules.c = COMMAND_LISTING_RULES
  textAddChats.c = MENU_ADD_CHAT
  textDelChats.c = MENU_DELETE_CHAT
  textAddAdmin.c = MENU_ADD_ADMIN
  textDelAdmin.c = MENU_DEL_ADMIN
  textRules.c = MENU_RULES

  const replyMarkupMenu:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply
    | undefined = {
    inline_keyboard: [
      [button(`Список чатов`, JSON.stringify(textListChats))],
      [
        button(`Добавить чат`, JSON.stringify(textAddChats)),
        button(`Удалить чат`, JSON.stringify(textDelChats)),
      ],
      [button(`Список админов`, JSON.stringify(textListAdmin))],
      [
        button(`Добавить админа`, JSON.stringify(textAddAdmin)),
        button(`Удалить админа`, JSON.stringify(textDelAdmin)),
      ],
      [button(`Изменить правила для чата`, JSON.stringify(textRules))],
    ],
  }
  return replyMarkupMenu
}
