import { Message } from 'node-telegram-bot-api'
import { menuWord } from '../../menu/menuWords.js'
import { createNewUser } from '../checking.js'
import {
  COMMAND_ADD_ADMIN,
  COMMAND_ADD_WORD,
  COMMAND_DEL_WORD,
  ICallback_query,
  IUser,
  NULL,
} from '../../global.js'
import {
  findUserInTableUsers,
  findOneChat,
  updateAdmins,
  saveNewUser,
  findWordInPersonalDB,
  createNewWordInPersonalDB,
  findWordInGeneralDB,
  createNewWordInGeneralDB,
  deleteWordInPersonalDB,
  deleteWordInGeneralDB,
  dbConnection,
} from '../requestBD.js'
import { viewGeneralMenu, zeroUserCommand } from '../additional.js'
import { bot } from '../bot.js'
import { logger } from '../logger.js'

export async function personalChatWithBot(msg: Message) {
  try {
    // если это личные сообщения в чате с ботом
    if (msg.from && msg.chat.id === msg.from.id) {
      const user: IUser | undefined = await findUserInTableUsers(
        msg.from.id.toString(),
        dbConnection
      )
      if (user !== undefined) {
        // если в профиле этого пользователя есть  команда на добавление админа
        if (
          user.command === COMMAND_ADD_ADMIN &&
          user.command_value &&
          (msg.forward_from || msg.forward_from_chat)
        ) {
          const myChat = await findOneChat(
            user.admin_id,
            user.command_value,
            dbConnection
          )
          let new_admin_id: string = ''
          if (msg.forward_from && msg.forward_from.id) {
            new_admin_id = msg.forward_from.id.toString()
          } else {
            if (msg.forward_from_chat)
              new_admin_id = msg.forward_from_chat.id.toString()
          }

          if (myChat.length > 0) {
            let arr_admins_id = myChat[0].admins.split(' ')
            const check_admin = arr_admins_id.includes(new_admin_id)
            if (!check_admin) {
              const strAdmins = `${myChat[0].admins} ${new_admin_id}`
              const save = await updateAdmins(
                user.command_value,
                strAdmins,
                dbConnection
              )
              if (save) {
                bot.sendMessage(msg.from.id, 'Админ добавлен к чату')
              } else {
                bot.sendMessage(msg.from.id, 'Ошибка записаны в БД')
              }
            } else {
              bot.sendMessage(msg.from.id, 'Такой админ уже есть')
            }
          } else {
            bot.sendMessage(msg.from.id, 'Ошибка распознания сообщения')
          }
          zeroUserCommand(user.admin_id)

          // ищем в таблице user пользователя, если его нет то добавляем
          const findUser = await findUserInTableUsers(
            new_admin_id,
            dbConnection
          )
          if (findUser !== undefined) {
            if (findUser.length === 0) {
              let newUser

              if (msg.forward_from && msg.forward_from.id) {
                newUser = createNewUser(msg.forward_from)
              } else {
                if (msg.forward_from_chat)
                  newUser = createNewUser(msg.forward_from_chat)
              }

              if (newUser !== undefined) {
                saveNewUser(newUser, dbConnection)
                if (saveNewUser.length > 0) {
                  bot.sendMessage(msg.chat.id, 'Пользователь создан')
                } else {
                  bot.sendMessage(msg.chat.id, 'Error save BD')
                }
              } else {
                bot.sendMessage(msg.chat.id, 'Error create new user')
              }
            } else {
              bot.sendMessage(
                msg.chat.id,
                'Такой пользователь уже существует в БД'
              )
            }
          } else {
            bot.sendMessage(msg.chat.id, 'Error find BD')
          }
          viewGeneralMenu(msg.from.id.toString(), msg.chat.id)
        }

        if (
          user.command === COMMAND_ADD_ADMIN &&
          user.command_value &&
          !msg.forward_from
        ) {
          bot.sendMessage(
            msg.chat.id,
            'В этом сообщении нет необходимой информации, перешлите другое сообщение'
          )
        }

        // добавление слов в БД
        if (
          user.command === COMMAND_ADD_WORD &&
          !msg.forward_from &&
          msg.text &&
          user.command_value
        ) {
          let data_query: ICallback_query = {
            u: NULL,
            d: NULL,
          }
          if (msg.text.trim().indexOf(' ') === -1) {
            // если значение команды не равно generalDB и generalFile значит там номер чата и добавляем в personalDB
            if (
              user.command_value !== 'generalDB' &&
              user.command_value !== 'generalFile'
            ) {
              const findWord = await findWordInPersonalDB(
                msg.text.trim(),
                user.command_value,
                dbConnection
              )

              if (findWord && findWord.length === 0) {
                const saveWord = await createNewWordInPersonalDB(
                  user.command_value,
                  msg.text.trim(),
                  dbConnection
                )
                if (saveWord) {
                  bot.sendMessage(msg.chat.id, 'Слово записано')
                } else {
                  bot.sendMessage(msg.chat.id, 'Ошибка записи в БД')
                }
              } else {
                bot.sendMessage(msg.chat.id, 'Такое слово есть')
              }
              data_query = {
                u: user.command_value,
                d: 'P_DB',
              }
            }
            // для записи слова в generalDB
            if (user.command_value === 'generalDB') {
              if (user.super_root_admin) {
                data_query = {
                  u: NULL,
                  d: 'G_DB',
                }
                const findWord = await findWordInGeneralDB(
                  msg.text.trim(),
                  dbConnection
                )
                if (findWord && findWord.length === 0) {
                  const saveWord = await createNewWordInGeneralDB(
                    msg.text.trim(),
                    dbConnection
                  )
                  if (saveWord) {
                    bot.sendMessage(msg.chat.id, 'Слово записано')
                  } else {
                    bot.sendMessage(msg.chat.id, 'Ошибка записи в БД')
                  }
                } else {
                  bot.sendMessage(msg.chat.id, 'Такое слово есть')
                }
              } else {
                bot.sendMessage(
                  msg.chat.id,
                  'У вас нет прав на редактирование этой базы слов'
                )
              }
            }
            // для записи слова в generalFile
            if (user.command_value === 'generalFile') {
              if (user.super_root_admin) {
                data_query = {
                  u: NULL,
                  d: 'G_F',
                }
              } else {
                bot.sendMessage(
                  msg.chat.id,
                  'У вас нет прав на редактирование этой базы слов'
                )
              }
            }
          }
          bot.sendMessage(msg.chat.id, ' _____ Words _____ ', {
            reply_markup: menuWord(data_query),
          })
          zeroUserCommand(user.admin_id)
        }

        // удаление слов из БД
        if (
          user.command === COMMAND_DEL_WORD &&
          !msg.forward_from &&
          msg.text &&
          user.command_value
        ) {
          let data_query: ICallback_query = {
            u: NULL,
            d: NULL,
          }
          if (msg.text.trim().indexOf(' ') === -1) {
            // если значение команды не равно generalDB и generalFile значит там номер чата и добавляем в personalDB
            if (
              user.command_value !== 'generalDB' &&
              user.command_value !== 'generalFile'
            ) {
              const findWord = await findWordInPersonalDB(
                msg.text.trim(),
                user.command_value,
                dbConnection
              )
              if (findWord && findWord.length > 0) {
                const deleteWord = await deleteWordInPersonalDB(
                  msg.text.trim(),
                  user.command_value,
                  dbConnection
                )
                if (deleteWord) {
                  bot.sendMessage(msg.chat.id, 'Слово удалено')
                } else {
                  bot.sendMessage(msg.chat.id, 'Ошибка записи в БД')
                }
              } else {
                bot.sendMessage(msg.chat.id, 'Такого слова нет')
              }
              data_query = {
                u: user.command_value,
                d: 'P_DB',
              }
            }
            // для записи слова в generalDB
            if (user.command_value === 'generalDB') {
              if (user.super_root_admin) {
                data_query = {
                  u: NULL,
                  d: 'G_DB',
                }
                const findWord = await findWordInGeneralDB(
                  msg.text.trim(),
                  dbConnection
                )
                if (findWord && findWord.length > 0) {
                  const saveWord = await deleteWordInGeneralDB(
                    msg.text.trim(),
                    dbConnection
                  )
                  if (saveWord) {
                    bot.sendMessage(msg.chat.id, 'Слово удалено')
                  } else {
                    bot.sendMessage(msg.chat.id, 'Ошибка записи в БД')
                  }
                } else {
                  bot.sendMessage(msg.chat.id, 'Такое слова не в БД')
                }
              } else {
                bot.sendMessage(
                  msg.chat.id,
                  'У вас нет прав на редактирование этой базы слов'
                )
              }
            }
            // для записи слова в generalFile
            if (user.command_value === 'generalFile') {
              if (user.super_root_admin) {
                data_query = {
                  u: NULL,
                  d: 'G_F',
                }
              } else {
                bot.sendMessage(
                  msg.chat.id,
                  'У вас нет прав на редактирование этой базы слов'
                )
              }
            }

            bot.sendMessage(msg.chat.id, ' _____ Words _____ ', {
              reply_markup: menuWord(data_query),
            })
            zeroUserCommand(user.admin_id)
          }
        }
        // ещё варианты сообщения с командами в личном чате с ботом
      }
    }
    return true
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module chat_with_bot.ts function personalChatWithBot',
      additional: error,
    })
  }
}
