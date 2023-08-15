import { Message, MessageEntity } from 'node-telegram-bot-api'
import { IChat, IUser, ITableChats, NULL } from '../global.js'
import { logger } from './logger.js'

export function checkingLink(msg: Message) {
  let result: boolean = false
  if (msg.entities) {
    result = findLink(msg.entities)
  } else if (msg.caption_entities) {
    result = findLink(msg.caption_entities)
  }
  return result
}

function findLink(entities: MessageEntity[]) {
  const linkURI = entities.find(function (item: MessageEntity) {
    if (
      item.type === 'text_link' ||
      item.type === 'hashtag' ||
      item.type === 'url' ||
      item.type === 'email' ||
      item.type === 'phone_number'
    )
      return true
  })
  const result = linkURI ? true : false
  return result
}

//TODO Сделать возможность проверки на разные типы ссылок

// export function checkingLinkCustom(msg: Message, ) {
//   let result: boolean = false;
//   if (msg.entities) {

//     result = findLink(msg.entities);
//   } else if (msg.caption_entities) {
//     result = findLink(msg.caption_entities);
//   }
//   return result;
// }

// function findLinkCustom(entities: MessageEntity[], type_link: string) {
//   const link = entities.find(function (item: MessageEntity) {
//     if (item.type === type_link) return true
//   })
//   const result = link ? true : false
//   return result
// }

export function createNewUser(
  data: any,
  command_start: boolean = false,
  super_root_admin: boolean = false
) {
  try {
    const newUser: IUser = {
      created_at: new Date(),
      updated_at: new Date(),
      admin_id: data.id,
      first_name: data.first_name
        ? data.first_name
        : data.title
        ? data.title
        : '0',
      last_name: data.last_name ? data.last_name : '0',
      username: data.username ? data.username : '0',
      language_code: data.language_code ? data.language_code : '0',
      is_premium: data.is_premium ? data.is_premium : false,
      command: data.command ? data.command : '0',
      command_value: data.command_value ? data.command_value : '0',
      is_bot: data.is_bot ? data.is_bot : 0,
      type: data.type ? data.type : data.is_bot ? 'bot' : 'human',
      command_start: command_start ? command_start : false,
      root_admin: false,
      super_root_admin: super_root_admin ? super_root_admin : false,
    }
    return newUser
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module checking.ts function createNewUser',
      additional: error,
    })
  }
  return undefined
}

export function createNewChat(user: IUser, chat: IChat) {
  try {
    const newChat: ITableChats = {
      created_at: new Date(),
      updated_at: new Date(),
      chat_id: chat.id ? chat.id?.toString() : NULL,
      title: chat.title ? chat.title : NULL,
      admins: user.admin_id,
      root_admin_id: user.admin_id,
    }
    return newChat
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module checking.ts function  createNewChat',
      additional: error,
    })
    return undefined
  }
}
