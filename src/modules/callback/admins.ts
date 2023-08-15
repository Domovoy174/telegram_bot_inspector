import TelegramBot from 'node-telegram-bot-api'
import {
  COMMAND_ADD_ADMIN,
  COMMAND_DELETE_ADMIN,
  COMMAND_VIEW_ADMINS,
  IUser,
  MENU_CHOOSE_DEL_ADMIN,
  NULL,
} from '../../global.js'
import { listChats } from '../../menu/button.js'
import {
  createAdminList,
  createListWithCommand,
  viewGeneralMenu,
} from '../additional.js'
import { bot } from '../bot.js'
import { logger } from '../logger.js'
import {
  find,
  updateAdmins,
  updateUserToRootAdmin,
  findOneChat,
  findUserInTableUsers,
  editCommandForUser,
  dbConnection,
} from '../requestBD.js'

export async function commandDeleteAdmin(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      const myChat = await find(info, dbConnection)

      let arr_admins_id = myChat[0].admins.split(' ')
      arr_admins_id.splice(arr_admins_id.indexOf(userId), 1)
      let strAdmins = ''
      for (let item of arr_admins_id) {
        strAdmins = `${strAdmins} ${item}`
      }

      const save = await updateAdmins(info, strAdmins.trim(), dbConnection)

      if (save) {
        bot.sendMessage(query.message.chat.id, `Администратор удален`)
      } else {
        bot.sendMessage(query.message.chat.id, `Ошибка удаления из БД`)
      }
      viewGeneralMenu(query.message.chat.id.toString(), query.message.chat.id)
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module admins.ts function commandDeleteAdmin',
      additional: error,
    })
  }
}

export async function commandDeleteRootAdmin(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      const updateUserToRoot = await updateUserToRootAdmin(
        userId,
        false,
        false,
        dbConnection
      )
      if (updateUserToRoot) {
        bot.sendMessage(
          query.message.chat.id,
          'С пользователя сняты права root admin'
        )
      } else {
        bot.sendMessage(query.message.chat.id, 'Ошибка добавления в БД')
      }
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module admins.ts function commandDeleteRootAdmin',
      additional: error,
    })
  }
}

export async function commandAddRootAdmin(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      const updateUserToRoot = await updateUserToRootAdmin(
        userId,
        false,
        true,
        dbConnection
      )
      if (updateUserToRoot) {
        bot.sendMessage(query.message.chat.id, 'Пользователь стал root admin')
      } else {
        bot.sendMessage(query.message.chat.id, 'Ошибка добавления в БД')
      }
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module admins.ts function commandAddRootAdmin',
      additional: error,
    })
  }
}

export async function commandViewAdmins(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      const arrAdmins: IUser[] = []

      const myChat = await findOneChat(userId, info, dbConnection)

      let arr_admins_id = myChat[0].admins.split(' ')

      for (let id of arr_admins_id) {
        const findUser = await findUserInTableUsers(id, dbConnection)

        const user = {
          admin_id: findUser.admin_id,
          first_name: findUser.first_name ? findUser.first_name : NULL,
          last_name: findUser.last_name ? findUser.last_name : NULL,
          username: findUser.username ? findUser.username : NULL,
        }
        arrAdmins.push(user)
      }

      bot.editMessageText(' _____ Список администраторов _____ ', {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
        reply_markup: listChats(
          createAdminList(arrAdmins, myChat[0].chat_id, 'NULL')
        ),
      })
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module admins.ts function commandViewAdmins',
      additional: error,
    })
  }
}

export async function commandListingAdmins(
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
          createListWithCommand(chats, COMMAND_VIEW_ADMINS)
        ),
      })
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module admins.ts function commandListingAdmins',
      additional: error,
    })
  }
}

export async function menuAddAdmin(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      // надо вывести список из кнопок. При нажатии на которую чат удаляется или слово пусто
      bot.editMessageText(' _____ Список чатов _____ ', {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
        reply_markup: listChats(
          createListWithCommand(chats, COMMAND_ADD_ADMIN)
        ),
      })
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module admins.ts function menuAddAdmin',
      additional: error,
    })
  }
}

export async function menuDelAdmin(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      // надо вывести список из кнопок. При нажатии на которую чат удаляется или слово пусто
      bot.editMessageText(' _____ Список чатов _____ ', {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
        reply_markup: listChats(
          createListWithCommand(chats, MENU_CHOOSE_DEL_ADMIN)
        ),
      })
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module admins.ts function menuDelAdmin',
      additional: error,
    })
  }
}

export async function menuChooseAdminDel(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      const arrAdmins: IUser[] = []
      const myChat = await findOneChat(userId, info, dbConnection)
      let arr_admins_id = myChat[0].admins.split(' ')
      for (let id of arr_admins_id) {
        const findUser = await findUserInTableUsers(id, dbConnection)
        const user = {
          admin_id: findUser.admin_id,
          first_name: findUser.first_name ? findUser.first_name : NULL,
          last_name: findUser.last_name ? findUser.last_name : NULL,
          username: findUser.username ? findUser.username : NULL,
        }
        arrAdmins.push(user)
      }
      bot.editMessageText(' _____ Список админов _____ ', {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
        reply_markup: listChats(
          createAdminList(arrAdmins, myChat[0].chat_id, COMMAND_DELETE_ADMIN)
        ),
      })
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module admins.ts function menuChooseAdminDel',
      additional: error,
    })
  }
}

export async function commandAddAdmin(
  command: string,
  userId: string,
  info: string,
  chats: any[],
  query: TelegramBot.CallbackQuery
) {
  try {
    if (query.data && query.from && query.message) {
      bot.sendMessage(
        query.message.chat.id,
        'Перешлите сюда любое сообщение от пользователя, которого нужно добавить как администратора'
      )
      const editAdmin = editCommandForUser(
        userId,
        { command: COMMAND_ADD_ADMIN, command_value: `${info}` },
        dbConnection
      )
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module admins.ts function commandAddAdmin',
      additional: error,
    })
  }
}
