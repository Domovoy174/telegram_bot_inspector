import { Message } from 'node-telegram-bot-api'
import { bot_id } from '../../index.js'
import { logger } from '../logger.js'

import { personalChatWithBot } from './chat_with_bot.js'
import { formBot, formBotZeroMessage } from './from_bot.js'
import { otherMessage } from './other_msg.js'

export async function message(msg: Message) {
  try {
    if (msg.from && msg.from.id === bot_id && !msg.text) {
      return await formBotZeroMessage(msg)
    }

    // если сообщение в чате было переправлено от этого бота
    if (msg.from && msg.forward_from && msg.forward_from.id === bot_id) {
      return await formBot(msg)
    }

    // если это личные сообщения в чате с ботом
    if (msg.from && msg.chat.id === msg.from.id) {
      return await personalChatWithBot(msg)
    }

    // для всех сообщения, которые не относятся к личному чату с ботом
    if (msg.from && msg.chat.id !== msg.from.id) {
      return await otherMessage(msg)
    }
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module message.ts function message',
      additional: error,
    })
  }
}
