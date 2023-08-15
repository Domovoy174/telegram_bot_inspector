import { Message } from 'node-telegram-bot-api'
import { path_dictionary, filename_dictionary } from '../../index.js'
import { bot } from '../bot.js'
import { checkingLink } from '../checking.js'
import { logger } from '../logger.js'
import {
  dbConnection,
  findChats,
  findRules,
  generalDBDictionary,
  personalDBDictionary,
} from '../requestBD.js'
import { findFileDictionary } from '../requestFile.js'

export async function otherMessage(msg: Message) {
  if (msg.from && msg.chat.id !== msg.from.id) {
    const MSG_FROM_ID = msg.from.id.toString()
    const MSG_CHAT_ID = msg.chat.id.toString()
    const chats = await findChats(MSG_CHAT_ID, dbConnection)
    if (chats !== undefined) {
      // находим всех админов для этого чата
      let arr_admins_id = chats.admins.split(' ')
      // проверяем сообщение, его написал админ или нет
      const isAdmin = arr_admins_id.includes(MSG_FROM_ID)
      // если сообщение написано не админом, то запускаем проверку
      if (!isAdmin) {
        Promise.all([
          findRules(msg.chat.id.toString(), dbConnection),
          generalDBDictionary(dbConnection),
          personalDBDictionary(msg.chat.id.toString(), dbConnection),
        ])
          .then((values) => {
            const rules = values[0]
            const generalDB_dictionary = values[1] ? values[1] : ''
            const personalDB_dictionary = values[2] ? values[2] : ''
            const textArray = msg.text ? msg.text?.trim().split(' ') : ''
            if (rules !== undefined) {
              let resultRuleLinkDelete: boolean = false
              let resultRuleGeneralDBDictionary: boolean = false
              let resultRulePersonalDBDictionary: boolean = false
              let resultRuleGeneralFileDictionary: boolean = false
              let userBan: boolean = false
              // проверка сообщения на содержание ссылок
              if (rules.link_delete) {
                resultRuleLinkDelete = checkingLink(msg)
              }
              // проверка слов в сообщении общему по словарю в БД
              if (rules.generalDB_dictionary) {
                for (let word of textArray) {
                  const wordTrue = generalDB_dictionary.indexOf(word)
                  if (wordTrue > -1) resultRuleGeneralDBDictionary = true
                }
              }
              // проверка слов в сообщении личному по словарю в БД
              if (rules.personalDB_dictionary) {
                for (let word of textArray) {
                  const wordTrue = personalDB_dictionary.indexOf(word)
                  if (wordTrue > -1) resultRulePersonalDBDictionary = true
                }
              }
              // проверка слов в сообщении по словарю в файле
              if (rules.generalFile_dictionary) {
                const words_dictionary = findFileDictionary(
                  filename_dictionary,
                  path_dictionary
                )
                if (words_dictionary) {
                  for (let word of textArray) {
                    const wordTrue = words_dictionary.find((item) => {
                      if (item.word.toLowerCase() === word.toLowerCase())
                        return true
                    })
                    if (wordTrue) resultRuleGeneralFileDictionary = true
                  }
                }
              }
              // результат всех проверок, если хоть одна вернула истину то сообщение удаляется
              if (
                resultRuleLinkDelete ||
                resultRuleGeneralDBDictionary ||
                resultRulePersonalDBDictionary ||
                resultRuleGeneralFileDictionary
              ) {
                bot.deleteMessage(msg.chat.id, msg.message_id)

                if (rules.user_block) {
                  // блокировать пользователя
                  bot.banChatMember(chats.chat_id, Number(MSG_FROM_ID))
                  userBan = true
                }

                if (rules.notify_admin) {
                  // отправить сообщение в чат к супер админу
                  bot.sendMessage(
                    chats.root_admin_id,
                    `Удалено сообщение в чате ${
                      chats.title
                    }  \nПользователь ${msg.from?.first_name} ${
                      userBan ? 'удалён' : 'не удалён'
                    }`
                  )
                }
              }
            } else {
              bot.sendMessage(
                chats.root_admin_id,
                `Ошибка чтения правил из БД для чата ${MSG_CHAT_ID}`
              )
            }
          })
          .catch((error) => {
            logger.error({
              date: new Date(),
              message: 'module other_msg.ts function otherMessage',
              additional: error,
            })
          })
      } else {
        // это сообщение от админа
      }
    }
  }
  return true
}
