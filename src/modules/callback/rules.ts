import TelegramBot from 'node-telegram-bot-api'
import {
  COMMAND_EDIT_RULES,
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
  COMMAND_VIEW_RULES,
} from '../../global.js'
import { listChats } from '../../menu/button.js'
import { createListWithCommand, viewControlMenu } from '../additional.js'
import { bot } from '../bot.js'
import { logger } from '../logger.js'
import { dbConnection, findRulesForChat, updateOneRule } from '../requestBD.js'

export async function rulesAll(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
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
        const myRules = await findRulesForChat(info, dbConnection)
        let command_action: boolean | undefined = undefined
        if (command[command.length - 1] === '0') command_action = false
        if (command[command.length - 1] === '1') command_action = true
        //-------------------------------------------------
        if (
          command === COMMAND_USER_BLOCK_TRUE &&
          command_action !== undefined
        ) {
          if (myRules && Boolean(myRules[0].user_block) !== command_action) {
            const rule = await updateOneRule(
              info,
              'user_block',
              true,
              dbConnection
            )
            if (rule) {
              const rules = await findRulesForChat(info, dbConnection)
              if (rules) {
                viewControlMenu(
                  userId,
                  info,
                  query.message.chat.id,
                  query.message.message_id,
                  rules[0]
                )
              } else {
                bot.sendMessage(userId, 'Ошибка чтения меток из БД')
              }
            } else {
              bot.sendMessage(userId, 'Ошибка записи метки в БД')
            }
          }
        }
        //-------------------------------------------------
        if (
          command === COMMAND_USER_BLOCK_FALSE &&
          command_action !== undefined
        ) {
          if (myRules && Boolean(myRules[0].user_block) !== command_action) {
            const rule = await updateOneRule(
              info,
              'user_block',
              false,
              dbConnection
            )
            if (rule) {
              const rules = await findRulesForChat(info, dbConnection)
              if (rules) {
                viewControlMenu(
                  userId,
                  info,
                  query.message.chat.id,
                  query.message.message_id,
                  rules[0]
                )
              } else {
                bot.sendMessage(userId, 'Ошибка чтения меток из БД')
              }
            } else {
              bot.sendMessage(userId, 'Ошибка записи метки в БД')
            }
          }
        }

        if (command === COMMAND_LINK_BLOCK_TRUE) {
          if (myRules && Boolean(myRules[0].link_delete) !== command_action) {
            const rule = await updateOneRule(
              info,
              'link_delete',
              true,
              dbConnection
            )
            if (rule) {
              const rules = await findRulesForChat(info, dbConnection)
              if (rules) {
                viewControlMenu(
                  userId,
                  info,
                  query.message.chat.id,
                  query.message.message_id,
                  rules[0]
                )
              } else {
                bot.sendMessage(userId, 'Ошибка чтения меток из БД')
              }
            } else {
              bot.sendMessage(userId, 'Ошибка записи метки в БД')
            }
          }
        }

        if (command === COMMAND_LINK_BLOCK_FALSE) {
          if (myRules && Boolean(myRules[0].link_delete) !== command_action) {
            const rule = await updateOneRule(
              info,
              'link_delete',
              false,
              dbConnection
            )
            if (rule) {
              const rules = await findRulesForChat(info, dbConnection)
              if (rules) {
                viewControlMenu(
                  userId,
                  info,
                  query.message.chat.id,
                  query.message.message_id,
                  rules[0]
                )
              } else {
                bot.sendMessage(userId, 'Ошибка чтения меток из БД')
              }
            } else {
              bot.sendMessage(userId, 'Ошибка записи метки в БД')
            }
          }
        }

        if (command === COMMAND_NOTIFY_ADMIN_TRUE) {
          if (myRules && Boolean(myRules[0].notify_admin) !== command_action) {
            const rule = await updateOneRule(
              info,
              'notify_admin',
              true,
              dbConnection
            )
            if (rule) {
              const rules = await findRulesForChat(info, dbConnection)
              if (rules) {
                viewControlMenu(
                  userId,
                  info,
                  query.message.chat.id,
                  query.message.message_id,
                  rules[0]
                )
              } else {
                bot.sendMessage(userId, 'Ошибка чтения меток из БД')
              }
            } else {
              bot.sendMessage(userId, 'Ошибка записи метки в БД')
            }
          }
        }

        if (command === COMMAND_NOTIFY_ADMIN_FALSE) {
          if (myRules && Boolean(myRules[0].notify_admin) !== command_action) {
            const rule = await updateOneRule(
              info,
              'notify_admin',
              false,
              dbConnection
            )
            if (rule) {
              const rules = await findRulesForChat(info, dbConnection)
              if (rules) {
                viewControlMenu(
                  userId,
                  info,
                  query.message.chat.id,
                  query.message.message_id,
                  rules[0]
                )
              } else {
                bot.sendMessage(userId, 'Ошибка чтения меток из БД')
              }
            } else {
              bot.sendMessage(userId, 'Ошибка записи метки в БД')
            }
          }
        }

        if (command === COMMAND_PERSONAL_DB_DICTIONARY_TRUE) {
          if (
            myRules &&
            Boolean(myRules[0].personalDB_dictionary) !== command_action
          ) {
            const rule = await updateOneRule(
              info,
              'personalDB_dictionary',
              true,
              dbConnection
            )
            if (rule) {
              const rules = await findRulesForChat(info, dbConnection)
              if (rules) {
                viewControlMenu(
                  userId,
                  info,
                  query.message.chat.id,
                  query.message.message_id,
                  rules[0]
                )
              } else {
                bot.sendMessage(userId, 'Ошибка чтения меток из БД')
              }
            } else {
              bot.sendMessage(userId, 'Ошибка записи метки в БД')
            }
          }
        }

        if (command === COMMAND_PERSONAL_DB_DICTIONARY_FALSE) {
          if (
            myRules &&
            Boolean(myRules[0].personalDB_dictionary) !== command_action
          ) {
            const rule = await updateOneRule(
              info,
              'personalDB_dictionary',
              false,
              dbConnection
            )
            if (rule) {
              const rules = await findRulesForChat(info, dbConnection)
              if (rules) {
                viewControlMenu(
                  userId,
                  info,
                  query.message.chat.id,
                  query.message.message_id,
                  rules[0]
                )
              } else {
                bot.sendMessage(userId, 'Ошибка чтения меток из БД')
              }
            } else {
              bot.sendMessage(userId, 'Ошибка записи метки в БД')
            }
          }
        }

        if (command === COMMAND_GENERAL_DB_DICTIONARY_TRUE) {
          if (
            myRules &&
            Boolean(myRules[0].generalDB_dictionary) !== command_action
          ) {
            const rule = await updateOneRule(
              info,
              'generalDB_dictionary',
              true,
              dbConnection
            )
            if (rule) {
              const rules = await findRulesForChat(info, dbConnection)
              if (rules) {
                viewControlMenu(
                  userId,
                  info,
                  query.message.chat.id,
                  query.message.message_id,
                  rules[0]
                )
              } else {
                bot.sendMessage(userId, 'Ошибка чтения меток из БД')
              }
            } else {
              bot.sendMessage(userId, 'Ошибка записи метки в БД')
            }
          }
        }

        if (command === COMMAND_GENERAL_DB_DICTIONARY_FALSE) {
          if (
            myRules &&
            Boolean(myRules[0].generalDB_dictionary) !== command_action
          ) {
            const rule = await updateOneRule(
              info,
              'generalDB_dictionary',
              false,
              dbConnection
            )
            if (rule) {
              const rules = await findRulesForChat(info, dbConnection)
              if (rules) {
                viewControlMenu(
                  userId,
                  info,
                  query.message.chat.id,
                  query.message.message_id,
                  rules[0]
                )
              } else {
                bot.sendMessage(userId, 'Ошибка чтения меток из БД')
              }
            } else {
              bot.sendMessage(userId, 'Ошибка записи метки в БД')
            }
          }
        }

        if (command === COMMAND_GENERAL_FILE_DICTIONARY_TRUE) {
          if (
            myRules &&
            Boolean(myRules[0].generalFile_dictionary) !== command_action
          ) {
            const rule = await updateOneRule(
              info,
              'generalFile_dictionary',
              true,
              dbConnection
            )
            if (rule) {
              const rules = await findRulesForChat(info, dbConnection)
              if (rules) {
                viewControlMenu(
                  userId,
                  info,
                  query.message.chat.id,
                  query.message.message_id,
                  rules[0]
                )
              } else {
                bot.sendMessage(userId, 'Ошибка чтения меток из БД')
              }
            } else {
              bot.sendMessage(userId, 'Ошибка записи метки в БД')
            }
          }
        }

        if (command === COMMAND_GENERAL_FILE_DICTIONARY_FALSE) {
          if (
            myRules &&
            Boolean(myRules[0].generalFile_dictionary) !== command_action
          ) {
            const rule = await updateOneRule(
              info,
              'generalFile_dictionary',
              false,
              dbConnection
            )
            if (rule) {
              const rules = await findRulesForChat(info, dbConnection)
              if (rules) {
                viewControlMenu(
                  userId,
                  info,
                  query.message.chat.id,
                  query.message.message_id,
                  rules[0]
                )
              } else {
                bot.sendMessage(userId, 'Ошибка чтения меток из БД')
              }
            } else {
              bot.sendMessage(userId, 'Ошибка записи метки в БД')
            }
          }
        }
      }
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module rules.ts function rulesAll',
      additional: error,
    })
  }
}

export async function commandListingRules(
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
        reply_markup: listChats(
          createListWithCommand(chats, COMMAND_VIEW_RULES)
        ),
      })
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module rules.ts function commandListingRules',
      additional: error,
    })
  }
}

export async function menuRules(
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
        reply_markup: listChats(
          createListWithCommand(chats, COMMAND_EDIT_RULES)
        ),
      })
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module rules.ts function menuRules',
      additional: error,
    })
  }
}

export async function menuEditRules(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      const rules = await findRulesForChat(info, dbConnection)
      if (rules) {
        viewControlMenu(
          userId,
          info,
          query.message.chat.id,
          query.message.message_id,
          rules[0]
        )
      } else {
        bot.sendMessage(userId, 'Ошибка чтения меток из БД')
      }
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module rules.ts function menuEditRules',
      additional: error,
    })
  }
}
