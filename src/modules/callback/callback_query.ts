import TelegramBot from 'node-telegram-bot-api'
import { menuChats } from '../../menu/menuChats.js'

import {
  COMMAND_ADD_ADMIN,
  COMMAND_ADD_ROOT_ADMIN,
  COMMAND_ADD_WORD,
  COMMAND_CHOOSE_GENERAL_DB,
  COMMAND_CHOOSE_GENERAL_FILE,
  COMMAND_CHOOSE_PERSONAL_DB,
  COMMAND_DELETE_ADMIN,
  COMMAND_DEL_ROOT_ADMIN,
  COMMAND_DEL_WORD,
  COMMAND_EDIT_RULES,
  COMMAND_GENERAL_DB_DICTIONARY_FALSE,
  COMMAND_GENERAL_DB_DICTIONARY_TRUE,
  COMMAND_GENERAL_FILE_DICTIONARY_FALSE,
  COMMAND_GENERAL_FILE_DICTIONARY_TRUE,
  COMMAND_LINK_BLOCK_FALSE,
  COMMAND_LINK_BLOCK_TRUE,
  COMMAND_LISTING_ADMINS,
  COMMAND_LISTING_CHATS,
  COMMAND_LISTING_CHATS_DB,
  COMMAND_LISTING_RULES,
  COMMAND_MENU_CHOOSE_BD,
  COMMAND_NEXT_PAGE,
  COMMAND_NOTIFY_ADMIN_FALSE,
  COMMAND_NOTIFY_ADMIN_TRUE,
  COMMAND_PERSONAL_DB_DICTIONARY_FALSE,
  COMMAND_PERSONAL_DB_DICTIONARY_TRUE,
  COMMAND_PREV_PAGE,
  COMMAND_USER_BLOCK_FALSE,
  COMMAND_USER_BLOCK_TRUE,
  COMMAND_VIEW_ADMINS,
  COMMAND_VIEW_WORDS,
  DELETE_THIS_CHAT,
  ICallback_query,
  IUser,
  MENU_ADD_ADMIN,
  MENU_ADD_CHAT,
  MENU_CHOOSE_DEL_ADMIN,
  MENU_DELETE_CHAT,
  MENU_DEL_ADMIN,
  MENU_GENERAL,
  MENU_RULES,
  NULL,
} from '../../global.js'

import {
  dbConnection,
  findChatsWithRootAdmin,
  findUserInTableUsers,
} from '../requestBD.js'
import {
  commandListingRules,
  menuEditRules,
  menuRules,
  rulesAll,
} from './rules.js'
import {
  addWord,
  chooseGeneralDB,
  chooseGeneralFile,
  choosePersonalDB,
  deleteWord,
  listingChatsDB,
  menuChooseDB,
  nextPage,
  prevPage,
  viewWords,
} from './words.js'
import {
  commandListingChats,
  deleteChat,
  menuAddChats,
  menuDeleteChats,
} from './chats.js'
import {
  commandAddAdmin,
  commandAddRootAdmin,
  commandDeleteAdmin,
  commandDeleteRootAdmin,
  commandListingAdmins,
  commandViewAdmins,
  menuAddAdmin,
  menuChooseAdminDel,
  menuDelAdmin,
} from './admins.js'
import { zeroUserCommand } from '../additional.js'
import { bot } from '../bot.js'
import { logger } from '../logger.js'

export async function callBackQuery(query: TelegramBot.CallbackQuery) {
  try {
    // console.log(`QUERY___start`)
    // console.log(query)
    // console.log(`QUERY___End`)

    if (query.data && query.from && query.message) {
      const user: IUser | undefined = await findUserInTableUsers(
        query.from.id.toString(),
        dbConnection
      )
      if (user !== undefined && (user.root_admin || user.super_root_admin)) {
        // Разбиваем команду на составляющие
        try {
          const dataQuery = JSON.parse(query.data)
          if (Object.keys(dataQuery).length > 0) {
            const command = dataQuery.c ? dataQuery.c : NULL
            const userId = dataQuery.u ? dataQuery.u : NULL
            const info = dataQuery.d ? dataQuery.d : NULL

            const chats = await findChatsWithRootAdmin(userId, dbConnection)

            if (command !== NULL) {
              if (command === MENU_GENERAL) {
                const data_query: ICallback_query = {
                  u: query.message.chat.id.toString(),
                  c: 'MENU',
                }

                bot.editMessageText(' _____ Главное меню _____ ', {
                  chat_id: query.message.chat.id,
                  message_id: query.message.message_id,
                  reply_markup: menuChats(data_query),
                })

                zeroUserCommand(query.message.chat.id.toString())
              }

              if (command === COMMAND_LISTING_CHATS) {
                await commandListingChats(command, userId, info, chats, query)
              }

              if (command === COMMAND_LISTING_ADMINS) {
                await commandListingAdmins(command, userId, info, chats, query)
              }

              if (command === COMMAND_LISTING_RULES) {
                await commandListingRules(command, userId, info, chats, query)
              }

              if (command === COMMAND_VIEW_ADMINS) {
                await commandViewAdmins(command, userId, info, chats, query)
              }

              if (command === MENU_ADD_CHAT) {
                await menuAddChats(command, userId, info, chats, query)
              }

              if (command === MENU_DELETE_CHAT) {
                await menuDeleteChats(command, userId, info, chats, query)
              }

              if (command === MENU_ADD_ADMIN) {
                await menuAddAdmin(command, userId, info, chats, query)
              }

              if (command === MENU_DEL_ADMIN) {
                await menuDelAdmin(command, userId, info, chats, query)
              }

              if (command === MENU_CHOOSE_DEL_ADMIN) {
                await menuChooseAdminDel(command, userId, info, chats, query)
              }

              if (command === MENU_RULES) {
                await menuRules(command, userId, info, chats, query)
              }

              if (command === COMMAND_ADD_ROOT_ADMIN) {
                await commandAddRootAdmin(command, userId, info, chats, query)
              }

              if (command === COMMAND_DEL_ROOT_ADMIN) {
                await commandDeleteRootAdmin(
                  command,
                  userId,
                  info,
                  chats,
                  query
                )
              }

              //=================================== Работа с БД словами  start ===========================================================

              if (command === COMMAND_MENU_CHOOSE_BD) {
                await menuChooseDB(command, userId, info, chats, query)
              }
              if (command === COMMAND_LISTING_CHATS_DB) {
                await listingChatsDB(command, userId, info, chats, query)
              }

              if (command === COMMAND_CHOOSE_PERSONAL_DB) {
                await choosePersonalDB(command, userId, info, chats, query)
              }

              if (command === COMMAND_CHOOSE_GENERAL_DB) {
                await chooseGeneralDB(command, userId, info, chats, query)
              }
              if (command === COMMAND_CHOOSE_GENERAL_FILE) {
                await chooseGeneralFile(command, userId, info, chats, query)
              }

              if (command === COMMAND_VIEW_WORDS) {
                await viewWords(command, userId, info, chats, query)
              }
              if (command === COMMAND_ADD_WORD) {
                await addWord(command, userId, info, chats, query)
              }
              if (command === COMMAND_DEL_WORD) {
                await deleteWord(command, userId, info, chats, query)
              }

              if (command === COMMAND_NEXT_PAGE) {
                await nextPage(command, userId, info, chats, query)
              }

              if (command === COMMAND_PREV_PAGE) {
                await prevPage(command, userId, info, chats, query)
              }

              //=================================== Работа с БД словами  end ===========================================================

              if (command === DELETE_THIS_CHAT) {
                await deleteChat(command, userId, info, chats, query)
              }

              if (command === COMMAND_DELETE_ADMIN) {
                await commandDeleteAdmin(command, userId, info, chats, query)
              }

              if (command === COMMAND_ADD_ADMIN) {
                await commandAddAdmin(command, userId, info, chats, query)
              }

              if (command === COMMAND_EDIT_RULES) {
                await menuEditRules(command, userId, info, chats, query)
              }

              if (
                command === COMMAND_USER_BLOCK_TRUE ||
                command === COMMAND_USER_BLOCK_FALSE ||
                command === COMMAND_LINK_BLOCK_TRUE ||
                command === COMMAND_LINK_BLOCK_FALSE ||
                COMMAND_NOTIFY_ADMIN_TRUE ||
                COMMAND_NOTIFY_ADMIN_FALSE ||
                COMMAND_PERSONAL_DB_DICTIONARY_TRUE ||
                COMMAND_PERSONAL_DB_DICTIONARY_FALSE ||
                COMMAND_GENERAL_DB_DICTIONARY_TRUE ||
                COMMAND_GENERAL_DB_DICTIONARY_FALSE ||
                COMMAND_GENERAL_FILE_DICTIONARY_TRUE ||
                COMMAND_GENERAL_FILE_DICTIONARY_FALSE
              ) {
                await rulesAll(command, userId, info, chats, query)
              }
            } else {
              // console.log('command NULL')
            }
          }
          // ищу есть ли такой чаты бд
          // если нет то добавляем
        } catch (error) {
          logger.error({
            date: new Date(),
            message:
              'module callback_query.ts function callBackQuery ERROR PARSE query.data',
            additional: error,
          })
          bot.sendMessage(query.message.chat.id, 'ERROR PARSE query.data')
        }
      } else {
        bot.sendMessage(
          query.from.id,
          'У вас нет прав на редактирование этой базы слов'
        )
      }
    }

    bot.answerCallbackQuery(query.id, { cache_time: 0 })
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module callback_query.ts function callBackQuery',
      additional: error,
    })
  }
}
