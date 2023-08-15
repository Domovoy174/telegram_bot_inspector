import TelegramBot from 'node-telegram-bot-api'
import { filename_dictionary, path_dictionary } from '../../index.js'
import { listChats } from '../../menu/button.js'
import { menuChooseBD } from '../../menu/menuChooseBD.js'
import { menuWord } from '../../menu/menuWords.js'
import { buttonMove } from '../../menu/move.js'
import {
  COMMAND_ADD_WORD,
  COMMAND_CHOOSE_GENERAL_DB,
  COMMAND_CHOOSE_GENERAL_FILE,
  COMMAND_CHOOSE_PERSONAL_DB,
  COMMAND_DEL_WORD,
  COMMAND_LISTING_CHATS_DB,
  COMMAND_MENU_CHOOSE_BD,
  COMMAND_NEXT_PAGE,
  COMMAND_VIEW_WORDS,
  ICallback_query,
  ICommand,
  IUser,
  NULL,
} from '../../global.js'
import {
  findUserInTableUsers,
  editCommandForUser,
  personalDBDictionary,
  generalDBDictionaryObject,
  personalDBDictionaryObject,
  dbConnection,
} from '../requestBD.js'
import { findFileDictionary } from '../requestFile.js'
import { createListChatsForDB } from '../additional.js'
import { bot } from '../bot.js'
import { logger } from '../logger.js'

export async function deleteWord(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      if (command === COMMAND_DEL_WORD) {
        if (info && info !== NULL) {
          let com: ICommand = {
            command: COMMAND_DEL_WORD,
            command_value: '',
          }

          if (info === 'P_DB') {
            com.command_value = userId
          }
          if (info === 'G_DB') {
            com.command_value = 'generalDB'
          }
          if (info === 'G_F') {
            com.command_value = 'generalFile'
          }
          const editAdmin = await editCommandForUser(
            query.message.chat.id.toString(),
            com,
            dbConnection
          )
          bot.sendMessage(
            query.message.chat.id,
            'Пришлите одно слово которое хотите удалить'
          )
        }
      }
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module words.ts function deleteWord',
      additional: error,
    })
  }
}

export async function addWord(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      if (command === COMMAND_ADD_WORD) {
        if (info && info !== NULL) {
          if (info === 'P_DB') {
            const editAdmin = await editCommandForUser(
              query.message.chat.id.toString(),
              { command: COMMAND_ADD_WORD, command_value: userId },
              dbConnection
            )
            bot.sendMessage(
              query.message.chat.id,
              'Пришлите одно слово которое хотите добавить'
            )
          }
          if (info === 'G_DB') {
            //
            const editAdmin = await editCommandForUser(
              query.message.chat.id.toString(),
              { command: COMMAND_ADD_WORD, command_value: 'generalDB' },
              dbConnection
            )
            bot.sendMessage(
              query.message.chat.id,
              'Пришлите одно слово которое хотите добавить'
            )
          }
          if (info === 'G_F') {
            //
            const editAdmin = await editCommandForUser(
              query.message.chat.id.toString(),
              { command: COMMAND_ADD_WORD, command_value: 'generalFile' },
              dbConnection
            )
            bot.sendMessage(
              query.message.chat.id,
              'Пришлите одно слово которое хотите добавить'
            )
          }
        }
      }
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module words.ts function addWord',
      additional: error,
    })
  }
}

export async function viewWords(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      if (command === COMMAND_VIEW_WORDS) {
        if (info && info !== NULL) {
          let editMessage: boolean = false
          let textMessage: string = ''
          let dbWord: any[] | undefined

          let data_query: ICallback_query = {
            u: userId,
            d: ` `,
          }

          if (info === 'P_DB') {
            dbWord = await personalDBDictionaryObject(userId, dbConnection)
          }
          if (info === 'G_DB') {
            dbWord = await generalDBDictionaryObject(dbConnection)
          }

          if (info === 'G_F') {
            dbWord = findFileDictionary(filename_dictionary, path_dictionary)
          }

          if (dbWord) {
            const result = viewPage(
              dbWord,
              1,
              textMessage,
              data_query,
              userId,
              info
            )
            if (result) {
              textMessage = result.textMessage
              data_query = result.data_query
              editMessage = result.editMessage
            }
          }

          if (editMessage) {
            bot.editMessageText(textMessage.trim(), {
              chat_id: query.message.chat.id,
              message_id: query.message.message_id,
              reply_markup: buttonMove(data_query, info),
            })
          }
        }
      }
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module words.ts function viewWords',
      additional: error,
    })
  }
}

export async function nextPage(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      if (command === COMMAND_NEXT_PAGE) {
        if (info && info !== NULL) {
          let dbWord: any[] | undefined
          let editMessage: boolean = false

          const db = info.slice(0, info.indexOf(' '))

          let textMessage: string = ''

          let page = Number(info.slice(info.indexOf('p') + 1, info.length)) + 1

          let data_query: ICallback_query = {
            u: userId,
            d: ` `,
          }

          if (db === 'P_DB') {
            dbWord = await personalDBDictionary(userId, dbConnection)
          }

          if (db === 'G_DB') {
            dbWord = await generalDBDictionaryObject(dbConnection)
          }

          if (db === 'G_F') {
            dbWord = findFileDictionary(filename_dictionary, path_dictionary)
          }

          if (dbWord) {
            const result = viewPage(
              dbWord,
              page,
              textMessage,
              data_query,
              userId,
              db
            )
            if (result) {
              textMessage = result.textMessage
              data_query = result.data_query
              editMessage = result.editMessage
            }
          }

          if (editMessage) {
            bot.editMessageText(textMessage.trim(), {
              chat_id: query.message.chat.id,
              message_id: query.message.message_id,
              reply_markup: buttonMove(data_query, db),
            })
          }
        }
      }
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module words.ts function nextPage',
      additional: error,
    })
  }
}

export async function prevPage(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      if (info && info !== NULL) {
        let editMessage: boolean = false

        let dbWord: any[] | undefined

        const db = info.slice(0, info.indexOf(' '))

        let textMessage: string = ''

        let page = Number(info.slice(info.indexOf('p') + 1, info.length)) - 1

        let data_query: ICallback_query = {
          u: userId,
          d: ` `,
        }

        if (db === 'P_DB') {
          dbWord = await personalDBDictionary(userId, dbConnection)
        }

        if (db === 'G_DB') {
          dbWord = await generalDBDictionaryObject(dbConnection)
        }

        if (db === 'G_F') {
          dbWord = findFileDictionary(filename_dictionary, path_dictionary)
        }

        if (dbWord) {
          const result = viewPage(
            dbWord,
            page,
            textMessage,
            data_query,
            userId,
            db
          )
          if (result) {
            textMessage = result.textMessage
            data_query = result.data_query
            editMessage = result.editMessage
          }
        }

        if (editMessage) {
          bot.editMessageText(textMessage.trim(), {
            chat_id: query.message.chat.id,
            message_id: query.message.message_id,
            reply_markup: buttonMove(data_query, db),
          })
        }
      }
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module words.ts function prevPage',
      additional: error,
    })
  }
}

export async function chooseGeneralFile(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      if (command === COMMAND_CHOOSE_GENERAL_FILE) {
        const data_query: ICallback_query = {
          u: userId,
          d: 'G_F',
        }
        bot.editMessageText('<- Words ->', {
          chat_id: query.message.chat.id,
          message_id: query.message.message_id,
          reply_markup: menuWord(data_query),
        })
      }
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module words.ts function chooseGeneralFile',
      additional: error,
    })
  }
}

export async function chooseGeneralDB(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      if (command === COMMAND_CHOOSE_GENERAL_DB) {
        const data_query: ICallback_query = {
          u: userId,
          d: 'G_DB',
        }
        bot.editMessageText('<- Words ->', {
          chat_id: query.message.chat.id,
          message_id: query.message.message_id,
          reply_markup: menuWord(data_query),
        })
      }
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module words.ts function chooseGeneralDB',
      additional: error,
    })
  }
}

export async function menuChooseDB(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      if (command === COMMAND_MENU_CHOOSE_BD) {
        const user: IUser | undefined = await findUserInTableUsers(
          query.message.chat.id.toString(),
          dbConnection
        )
        if (user !== undefined && (user.super_root_admin || user.root_admin)) {
          const data_query: ICallback_query = {
            u: query.message.chat.id.toString(),
            d: NULL,
          }
          bot.editMessageText('<- Выберите с какой базой нужно работать ->', {
            chat_id: query.message.chat.id,
            message_id: query.message.message_id,
            reply_markup: menuChooseBD(data_query),
          })
        }
      }
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module words.ts function menuChooseDB',
      additional: error,
    })
  }
}

export async function listingChatsDB(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      if (command === COMMAND_LISTING_CHATS_DB) {
        bot.editMessageText('<- Список чатов ->', {
          chat_id: query.message.chat.id,
          message_id: query.message.message_id,
          reply_markup: listChats(
            createListChatsForDB(chats, COMMAND_CHOOSE_PERSONAL_DB)
          ),
        })
      }
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module words.ts function listingChatsDB',
      additional: error,
    })
  }
}

export async function choosePersonalDB(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      if (command === COMMAND_CHOOSE_PERSONAL_DB) {
        const data_query: ICallback_query = {
          u: userId,
          d: 'P_DB',
        }
        bot.editMessageText('<- Words ->', {
          chat_id: query.message.chat.id,
          message_id: query.message.message_id,
          reply_markup: menuWord(data_query),
        })
      }
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module words.ts function listingChatsDB',
      additional: error,
    })
  }
}

function viewPage(
  dbWord: any[],
  page: number,
  textMessage: string,
  data_query: ICallback_query,
  userId: string,
  db: string
) {
  try {
    const pages = numberOfPages(dbWord)

    let editMessage: boolean = false

    if (pages && pages > 0) {
      if (page <= pages && page !== 0) {
        let start_word = Math.round((page - 1) * 100)
        let end_word = Math.round(page * 100)
        if (end_word > dbWord.length) end_word = dbWord.length

        for (let key = start_word; key < end_word; key++) {
          textMessage = textMessage + ' ' + dbWord[key].word + ','
        }

        data_query = {
          u: userId,
          d: `${db} p${page}`,
        }

        editMessage = true
      }
      textMessage = textMessage + `\n \n \n____ page № ${page}`
    } else {
      textMessage = 'НЕТ СЛОВ В БД'

      data_query = {
        u: userId,
        d: `${db} p${page}`,
      }

      editMessage = true
      textMessage = textMessage + `\n \n \n____ page № 0`
    }

    textMessage = textMessage + `\nДата и время: ${new Date()}`

    return { textMessage, data_query, editMessage }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module words.ts function viewPage',
      additional: error,
    })
  }
}

function numberOfPages(dbWord: any[]) {
  try {
    let pages: number = 0
    const length = dbWord.length
    if (length > 0) {
      const remainder_word = length % 100
      const pages_word = Math.round((length - remainder_word) / 100)
      if (remainder_word > 0) {
        pages = pages_word + 1
      } else {
        pages = pages_word
      }
    }
    return pages
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module words.ts function numberOfPages',
      additional: error,
    })
  }
}
