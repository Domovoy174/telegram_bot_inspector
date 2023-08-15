import {
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove,
  ForceReply,
} from 'node-telegram-bot-api'
import {
  COMMAND_GENERAL_DB_DICTIONARY_FALSE,
  COMMAND_GENERAL_DB_DICTIONARY_TRUE,
  COMMAND_GENERAL_FILE_DICTIONARY_FALSE,
  COMMAND_GENERAL_FILE_DICTIONARY_TRUE,
  COMMAND_LINK_BLOCK_FALSE,
  COMMAND_LINK_BLOCK_TRUE,
  COMMAND_NOTIFY_ADMIN_FALSE,
  COMMAND_NOTIFY_ADMIN_TRUE,
  COMMAND_PERSONAL_DB_DICTIONARY_FALSE,
  COMMAND_PERSONAL_DB_DICTIONARY_TRUE,
  COMMAND_USER_BLOCK_FALSE,
  COMMAND_USER_BLOCK_TRUE,
  ICallback_query,
  ITableRules,
  MENU_GENERAL,
  NULL,
} from '../global.js'
import { button } from './button.js'

export const menuControls = (
  data_query: ICallback_query,
  rules: ITableRules
) => {
  const user_block = rules.user_block ? 'true' : 'false'
  const link_delete = rules.link_delete ? 'true' : 'false'
  const notify_admin = rules.notify_admin ? 'true' : 'false'
  const personalDB_dictionary = rules.personalDB_dictionary ? 'true' : 'false'
  const generalDB_dictionary = rules.generalDB_dictionary ? 'true' : 'false'
  const generalFile_dictionary = rules.generalFile_dictionary ? 'true' : 'false'

  let textUserBlockTrue: ICallback_query = {}
  let textUserBlockFalse: ICallback_query = {}
  let textLinkTrue: ICallback_query = {}
  let textLinkFalse: ICallback_query = {}
  let textNotifyTrue: ICallback_query = {}
  let textNotifyFalse: ICallback_query = {}
  let textPerDBTrue: ICallback_query = {}
  let textPerDBFalse: ICallback_query = {}
  let textGenDBTrue: ICallback_query = {}
  let textGenDBFalse: ICallback_query = {}
  let textGenFileTrue: ICallback_query = {}
  let textGenFileFalse: ICallback_query = {}

  let textRules: ICallback_query = {}

  Object.assign(textUserBlockTrue, data_query)
  Object.assign(textUserBlockFalse, data_query)
  Object.assign(textLinkTrue, data_query)
  Object.assign(textLinkFalse, data_query)
  Object.assign(textNotifyTrue, data_query)
  Object.assign(textNotifyFalse, data_query)
  Object.assign(textPerDBTrue, data_query)
  Object.assign(textPerDBFalse, data_query)
  Object.assign(textGenDBTrue, data_query)
  Object.assign(textGenDBFalse, data_query)
  Object.assign(textGenFileTrue, data_query)
  Object.assign(textGenFileFalse, data_query)
  Object.assign(textRules, data_query)

  textLinkTrue.c = COMMAND_LINK_BLOCK_TRUE
  textLinkFalse.c = COMMAND_LINK_BLOCK_FALSE
  textUserBlockTrue.c = COMMAND_USER_BLOCK_TRUE
  textUserBlockFalse.c = COMMAND_USER_BLOCK_FALSE
  textNotifyTrue.c = COMMAND_NOTIFY_ADMIN_TRUE
  textNotifyFalse.c = COMMAND_NOTIFY_ADMIN_FALSE
  textPerDBTrue.c = COMMAND_PERSONAL_DB_DICTIONARY_TRUE
  textPerDBFalse.c = COMMAND_PERSONAL_DB_DICTIONARY_FALSE
  textGenDBTrue.c = COMMAND_GENERAL_DB_DICTIONARY_TRUE
  textGenDBFalse.c = COMMAND_GENERAL_DB_DICTIONARY_FALSE
  textGenFileTrue.c = COMMAND_GENERAL_FILE_DICTIONARY_TRUE
  textGenFileFalse.c = COMMAND_GENERAL_FILE_DICTIONARY_FALSE
  textRules.c = MENU_GENERAL

  const replyMarkupMenu:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply
    | undefined = {
    inline_keyboard: [
      [button(`Блокировка пользователя:   ${user_block}`, NULL)],
      [
        button(`Вкл`, JSON.stringify(textUserBlockTrue)),
        button(`Выкл`, JSON.stringify(textUserBlockFalse)),
      ],
      [button(`====================`, NULL)],
      [button(`Удаление ссылок:   ${link_delete}`, NULL)],
      [
        button(`Вкл`, JSON.stringify(textLinkTrue)),
        button(`Выкл`, JSON.stringify(textLinkFalse)),
      ],
      [button(`====================`, NULL)],
      [button(`Уведомление администратора:   ${notify_admin}`, NULL)],
      [
        button(`Вкл`, JSON.stringify(textNotifyTrue)),
        button(`Выкл`, JSON.stringify(textNotifyFalse)),
      ],
      [button(`====================`, NULL)],
      [button(`Общий словарь в БД:   ${generalDB_dictionary}`, NULL)],
      [
        button(`Вкл`, JSON.stringify(textGenDBTrue)),
        button(`Выкл`, JSON.stringify(textGenDBFalse)),
      ],
      [button(`====================`, NULL)],
      [button(`Частный словарь в БД:   ${personalDB_dictionary}`, NULL)],
      [
        button(`Вкл частный словарь`, JSON.stringify(textPerDBTrue)),
        button(`Выкл частный словарь`, JSON.stringify(textPerDBFalse)),
      ],
      [button(`====================`, NULL)],
      [button(`Частный словарь из файла:  ${generalFile_dictionary}`, NULL)],
      [
        button(`Вкл словарь из файла`, JSON.stringify(textGenFileTrue)),
        button(`Выкл словарь из файла`, JSON.stringify(textGenFileFalse)),
      ],
      [button(`====================`, NULL)],
      [button('<=ГЛАВНОЕ МЕНЮ =>', JSON.stringify(textRules))],
    ],
  }
  return replyMarkupMenu
}
