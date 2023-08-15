import {
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove,
  ForceReply,
} from 'node-telegram-bot-api'
import {
  COMMAND_CHOOSE_GENERAL_DB,
  COMMAND_CHOOSE_GENERAL_FILE,
  COMMAND_CHOOSE_PERSONAL_DB,
  COMMAND_NEXT_PAGE,
  COMMAND_PREV_PAGE,
  ICallback_query,
} from '../global.js'
import { button } from './button.js'

export const buttonMove = (data_query: ICallback_query, db: string) => {
  let textPrevPage: ICallback_query = {}
  let textNextPage: ICallback_query = {}
  let textMenu: ICallback_query = {}

  Object.assign(textPrevPage, data_query)
  Object.assign(textNextPage, data_query)
  Object.assign(textMenu, data_query)

  if (db === 'P_DB') textMenu.c = COMMAND_CHOOSE_PERSONAL_DB
  if (db === 'G_DB') textMenu.c = COMMAND_CHOOSE_GENERAL_DB
  if (db === 'G_F') textMenu.c = COMMAND_CHOOSE_GENERAL_FILE

  textPrevPage.c = COMMAND_PREV_PAGE
  textNextPage.c = COMMAND_NEXT_PAGE

  const replyMarkupMenu:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply
    | undefined = {
    inline_keyboard: [
      [
        button(`пред. стр`, JSON.stringify(textPrevPage)),
        button(`МЕНЮ`, JSON.stringify(textMenu)),
        button(`след. стр`, JSON.stringify(textNextPage)),
      ],
    ],
  }
  return replyMarkupMenu
}
