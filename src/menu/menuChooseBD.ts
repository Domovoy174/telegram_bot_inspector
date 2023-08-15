import {
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove,
  ForceReply,
} from 'node-telegram-bot-api'
import {
  COMMAND_CHOOSE_GENERAL_DB,
  COMMAND_CHOOSE_GENERAL_FILE,
  COMMAND_LISTING_CHATS_DB,
  ICallback_query,
  MENU_GENERAL,
} from '../global.js'
import { button } from './button.js'

export const menuChooseBD = (data_query: ICallback_query) => {
  let textPersonalListChats: ICallback_query = {}
  let textChooseGeneralDB: ICallback_query = {}
  let textChooseGeneralFile: ICallback_query = {}
  let textMenuGeneral: ICallback_query = {}

  Object.assign(textPersonalListChats, data_query)
  Object.assign(textChooseGeneralDB, data_query)
  Object.assign(textChooseGeneralFile, data_query)
  Object.assign(textMenuGeneral, data_query)

  textPersonalListChats.c = COMMAND_LISTING_CHATS_DB
  textChooseGeneralDB.c = COMMAND_CHOOSE_GENERAL_DB
  textChooseGeneralFile.c = COMMAND_CHOOSE_GENERAL_FILE
  textMenuGeneral.c = MENU_GENERAL

  const replyMarkupMenu:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply
    | undefined = {
    inline_keyboard: [
      [button(`General File`, JSON.stringify(textChooseGeneralFile))],
      [button(`General DB`, JSON.stringify(textChooseGeneralDB))],
      [button(`Personal DB`, JSON.stringify(textPersonalListChats))],
      [button(`Главное меню`, JSON.stringify(textMenuGeneral))],
    ],
  }
  return replyMarkupMenu
}
