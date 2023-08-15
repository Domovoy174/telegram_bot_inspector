import {
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove,
  ForceReply,
} from 'node-telegram-bot-api'
import {
  COMMAND_ADD_WORD,
  COMMAND_DEL_WORD,
  COMMAND_MENU_CHOOSE_BD,
  COMMAND_VIEW_WORDS,
  ICallback_query,
} from '../global.js'
import { button } from './button.js'

export const menuWord = (data_query: ICallback_query) => {
  let textViewWords: ICallback_query = {}
  let textAddWord: ICallback_query = {}
  let textDelWord: ICallback_query = {}
  let textMenuChooseBD: ICallback_query = {}

  Object.assign(textViewWords, data_query)
  Object.assign(textAddWord, data_query)
  Object.assign(textDelWord, data_query)
  Object.assign(textMenuChooseBD, data_query)

  textViewWords.c = COMMAND_VIEW_WORDS
  textAddWord.c = COMMAND_ADD_WORD
  textDelWord.c = COMMAND_DEL_WORD
  textMenuChooseBD.c = COMMAND_MENU_CHOOSE_BD

  const replyMarkupMenu:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply
    | undefined = {
    inline_keyboard: [
      [button(`Посмотреть слова`, JSON.stringify(textViewWords))],
      [button(`Добавить слово`, JSON.stringify(textAddWord))],
      [button(`Удалить слово`, JSON.stringify(textDelWord))],
      [button(`Меню выбора БД`, JSON.stringify(textMenuChooseBD))],
    ],
  }
  return replyMarkupMenu
}
