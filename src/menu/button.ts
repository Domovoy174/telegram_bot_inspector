import {
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove,
  ForceReply,
  InlineKeyboardButton,
} from 'node-telegram-bot-api'

export interface IInlineButton {
  text: string
  callback_data: string
}

export const button = (text: string, callback_data: string) => {
  const itemButton: InlineKeyboardButton = {
    text,
    callback_data,
  }
  return itemButton
}

export const listButton = (arrInfo: IInlineButton[]) => {
  const arrButton: InlineKeyboardButton[][] = []
  arrInfo.map((item) => {
    arrButton.push([button(item.text, item.callback_data)])
  })
  return arrButton
}

export const listChats = (list: IInlineButton[]) => {
  const replyMarkupMenu:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply
    | undefined = {
    inline_keyboard: listButton(list),
  }
  return replyMarkupMenu
}
