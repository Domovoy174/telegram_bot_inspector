import {
  ICallback_query,
  ICommand,
  ITableChats,
  ITableRules,
  IUser,
  MENU_GENERAL,
  NULL,
} from '../global.js'
import { IInlineButton } from '../menu/button.js'
import { menuChats } from '../menu/menuChats.js'
import { menuControls } from '../menu/menuControls.js'
import { bot } from './bot.js'
import { dbConnection, editCommandForUser } from './requestBD.js'

export function viewGeneralMenu(userId: string, chat_id: number) {
  setTimeout(() => {
    const data_query: ICallback_query = {
      u: userId,
      c: 'MENU',
    }
    bot.sendMessage(chat_id, ' _____ Главное меню _____ ', {
      reply_markup: menuChats(data_query),
    })
    return true
  }, 1000)
}

export function viewControlMenu(
  userId: string,
  info: string,
  chat_id: number,
  message_id: number,
  rules: ITableRules
) {
  const data_query: ICallback_query = {
    u: userId,
    d: info,
  }
  bot.editMessageText(' _____ Меню контроля _____ ', {
    chat_id,
    message_id,
    reply_markup: menuControls(data_query, rules),
  })
}

export function createList(data: ITableChats[]) {
  const arr: IInlineButton[] = []
  if (data.length !== 0) {
    data.forEach((item) => {
      const callbackData: ICallback_query = {
        c: NULL,
        u: item.root_admin_id,
        d: NULL,
      }

      const info: IInlineButton = {
        text: item.title,
        callback_data: JSON.stringify(callbackData),
      }
      arr.push(info)
    })
  } else {
    const callbackData: ICallback_query = {
      c: NULL,
      u: NULL,
      d: NULL,
    }
    const info: IInlineButton = {
      text: 'пусто',
      callback_data: JSON.stringify(callbackData),
    }
    arr.push(info)
  }

  const callbackGeneralMenu: ICallback_query = {
    c: MENU_GENERAL,
    u: NULL,
    d: NULL,
  }
  const generalButton: IInlineButton = {
    text: '<=ГЛАВНОЕ МЕНЮ =>',
    callback_data: JSON.stringify(callbackGeneralMenu),
  }

  arr.push(generalButton)

  return arr
}

export function createListChatsForDB(data: ITableChats[], command: string) {
  const arr: IInlineButton[] = []

  if (data.length !== 0) {
    data.forEach((item) => {
      const callbackData: ICallback_query = {
        c: command,
        u: item.chat_id,
        d: 'P_DB',
      }

      const info: IInlineButton = {
        text: item.title,
        callback_data: JSON.stringify(callbackData),
      }
      arr.push(info)
    })
  } else {
    const callbackData: ICallback_query = {
      c: NULL,
      u: NULL,
      d: NULL,
    }
    const info: IInlineButton = {
      text: 'пусто',
      callback_data: JSON.stringify(callbackData),
    }
    arr.push(info)
  }

  const callbackGeneralMenu: ICallback_query = {
    c: MENU_GENERAL,
    u: NULL,
    d: NULL,
  }
  const generalButton: IInlineButton = {
    text: '<=ГЛАВНОЕ МЕНЮ =>',
    callback_data: JSON.stringify(callbackGeneralMenu),
  }

  arr.push(generalButton)

  return arr
}

export function createListWithCommand(data: ITableChats[], command: string) {
  const arr: IInlineButton[] = []

  if (data.length !== 0) {
    data.forEach((item) => {
      const callbackData: ICallback_query = {
        c: command,
        u: item.root_admin_id,
        d: item.chat_id,
      }

      const info: IInlineButton = {
        text: item.title,
        callback_data: JSON.stringify(callbackData),
      }
      arr.push(info)
    })
  } else {
    const callbackData: ICallback_query = {
      c: NULL,
      u: NULL,
      d: NULL,
    }
    const info: IInlineButton = {
      text: 'пусто',
      callback_data: JSON.stringify(callbackData),
    }
    arr.push(info)
  }

  const callbackGeneralMenu: ICallback_query = {
    c: MENU_GENERAL,
    u: NULL,
    d: NULL,
  }

  const generalButton: IInlineButton = {
    text: '<=ГЛАВНОЕ МЕНЮ =>',
    callback_data: JSON.stringify(callbackGeneralMenu),
  }

  arr.push(generalButton)

  return arr
}

export function createAdminList(
  data: IUser[],
  chat_id: string,
  command: string
) {
  const arr: IInlineButton[] = []
  if (data.length !== 0) {
    data.forEach((item) => {
      const callbackData: ICallback_query = {
        c: command,
        u: item.admin_id,
        d: chat_id,
      }

      let text = ''
      if (item.admin_id) text = `${text}ID:${item.admin_id}`
      if (
        item.first_name &&
        item.first_name !== NULL &&
        item.first_name.length > 1
      )
        text = `${text} ${item.first_name}`
      if (item.last_name && item.last_name && item.last_name.length > 1)
        text = `${text} ${item.last_name}`
      if (item.username && item.username && item.username.length > 1)
        text = `${text} ${item.username}`

      const info: IInlineButton = {
        text,
        callback_data: JSON.stringify(callbackData),
      }
      arr.push(info)
    })
  } else {
    const callbackData: ICallback_query = {
      c: NULL,
      u: NULL,
      d: NULL,
    }
    const info: IInlineButton = {
      text: 'пусто',
      callback_data: JSON.stringify(callbackData),
    }
    arr.push(info)
  }
  const callbackGeneralMenu: ICallback_query = {
    c: MENU_GENERAL,
    u: chat_id,
    d: chat_id,
  }
  const generalButton: IInlineButton = {
    text: '<=ГЛАВНОЕ МЕНЮ =>',
    callback_data: JSON.stringify(callbackGeneralMenu),
  }

  arr.push(generalButton)

  return arr
}

export async function zeroUserCommand(id: string) {
  const command: ICommand = {
    command: '0',
    command_value: '0',
  }
  await editCommandForUser(id, command, dbConnection)
}
