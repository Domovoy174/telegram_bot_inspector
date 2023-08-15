import 'dotenv/config'
import TelegramBot from 'node-telegram-bot-api'
import {
  KEYBOARD_START_BOT,
  KEYBOARD_COMMAND_CHOOSE_ROOT_ADMIN,
  KEYBOARD_COMMAND_DEL_ROOT_ADMIN,
  KEYBOARD_COMMAND_MENU_WORDS,
  KEYBOARD_COMMAND_MENU,
} from '../global.js'

import { configOptions, owner_this_bot, secret } from '../index.js'
import { callBackQuery } from './callback/callback_query.js'
import { keyboardCommandChooseRootAdmin } from './keyboard_command/choose_root_admin.js'
import { keyboardCommandDeleteRootAdmin } from './keyboard_command/del_root_admin.js'
import { keyboardCommandGeneralMenu } from './keyboard_command/general_menu.js'
import { keyboardCommandRequestRoot } from './keyboard_command/request_root.js'
import { keyboardCommandStart } from './keyboard_command/start.js'
import { keyboardCommandSuperRoot } from './keyboard_command/super_root.js'
import { keyboardCommandWords } from './keyboard_command/words.js'
import { logger } from './logger.js'
import { message } from './message/message.js'

// выход с кодом 1, если нет необходимых входных данных
if (configOptions === undefined) {
  logger.error({
    date: new Date(),
    message: 'module bot.ts',
    additional: `configOptions = ${configOptions}`,
  })
  process.exit(1)
}

export const bot = new TelegramBot(configOptions.token, { polling: true })
try {
  // Любое входящее сообщение
  bot.on('message', async (msg) => {
    await message(msg)
  })

  // команды меню
  bot.onText(new RegExp(`${KEYBOARD_START_BOT}`), async (msg) => {
    await keyboardCommandStart(msg, owner_this_bot)
  })

  bot.onText(new RegExp(`${secret}`), async (msg) => {
    await keyboardCommandSuperRoot(msg)
  })

  bot.onText(
    new RegExp(`${KEYBOARD_COMMAND_CHOOSE_ROOT_ADMIN}`),
    async (msg) => {
      await keyboardCommandChooseRootAdmin(msg)
    }
  )

  bot.onText(new RegExp(`${KEYBOARD_COMMAND_DEL_ROOT_ADMIN}`), async (msg) => {
    await keyboardCommandDeleteRootAdmin(msg)
  })

  bot.onText(new RegExp(`${KEYBOARD_COMMAND_MENU_WORDS}`), async (msg) => {
    await keyboardCommandWords(msg)
  })

  bot.onText(new RegExp(`${KEYBOARD_COMMAND_MENU}`), async (msg) => {
    await keyboardCommandGeneralMenu(msg)
  })

  bot.onText(new RegExp(`${keyboardCommandRequestRoot}`), async (msg) => {
    await keyboardCommandRequestRoot(msg)
  })

  // команды кнопок
  bot.on('callback_query', async (query) => {
    await callBackQuery(query)
  })
} catch (error) {
  logger.error({
    date: new Date(),
    message: 'module bot.ts',
    additional: error,
  })
}
