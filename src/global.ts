export const KEYBOARD_COMMAND = '/'
export const KEYBOARD_START_BOT = '/start'
export const KEYBOARD_COMMAND_MENU = '/command_menu'
export const KEYBOARD_COMMAND_ADD_CHAT = '/command_add_chat'
export const KEYBOARD_COMMAND_CHOOSE_ROOT_ADMIN = '/choose_root_admin'
export const KEYBOARD_COMMAND_DEL_ROOT_ADMIN = '/del_root_admin'
export const KEYBOARD_COMMAND_MENU_WORDS = '/words'
export const DELETE_THIS_CHAT = 'del_this_chat'
export const COMMAND_DELETE_ADMIN = 'com_delete_admin'
export const COMMAND_ADD_ADMIN = 'com_add_admin'
export const COMMAND_ADD_ROOT_ADMIN = 'c_add_root_admin'
export const COMMAND_DEL_ROOT_ADMIN = 'c_del_root_admin'
export const COMMAND_ADD_CHAT = 'com_add_chat'
export const COMMAND_DELETE_CHAT = 'com_del_chat'
export const MENU_CHOOSE_DEL_ADMIN = 'm_choose_del_admin'
export const COMMAND_VIEW_ADMINS = 'c_view_admins'
export const COMMAND_VIEW_RULES = 'c_view_rules'
export const COMMAND_EDIT_RULES = 'c_edit_rules'
export const MENU_GENERAL = 'm_general'
export const secret = process.env.SECRET || 'secret'
export const COMMAND_PREV_PAGE = 'prev_pg'
export const COMMAND_NEXT_PAGE = 'next_pg'
export const COMMAND_VIEW_WORDS = 'c_v_words'
export const COMMAND_ADD_WORD = 'c_add_word'
export const COMMAND_DEL_WORD = 'c_del_word'
export const COMMAND_USER_BLOCK_TRUE = 'c_user_1'
export const COMMAND_USER_BLOCK_FALSE = 'c_user_0'
export const COMMAND_LINK_BLOCK_TRUE = 'c_link_1'
export const COMMAND_LINK_BLOCK_FALSE = 'c_link_0'
export const COMMAND_NOTIFY_ADMIN_TRUE = 'c_notify_1'
export const COMMAND_NOTIFY_ADMIN_FALSE = 'c_notify_0'
export const COMMAND_PERSONAL_DB_DICTIONARY_TRUE = 'c_perDB_1'
export const COMMAND_PERSONAL_DB_DICTIONARY_FALSE = 'c_perDB_0'
export const COMMAND_GENERAL_DB_DICTIONARY_TRUE = 'c_genDB_1'
export const COMMAND_GENERAL_DB_DICTIONARY_FALSE = 'c_genDB_0'
export const COMMAND_GENERAL_FILE_DICTIONARY_TRUE = 'c_genFile_1'
export const COMMAND_GENERAL_FILE_DICTIONARY_FALSE = 'c_genFile_0'
export const COMMAND_LISTING_CHATS_DB = 'P_DB_l_chats'
export const COMMAND_CHOOSE_PERSONAL_DB = 'P_DB_m_words'
export const COMMAND_CHOOSE_GENERAL_DB = 'G_DB_m_words'
export const COMMAND_CHOOSE_GENERAL_FILE = 'G_Fl_m_words'
export const COMMAND_LISTING_CHATS = 'list_chats'
export const COMMAND_LISTING_ADMINS = 'list_admin'
export const COMMAND_LISTING_RULES = 'list_rules'
export const MENU_ADD_CHAT = 'm_add_chat'
export const MENU_DELETE_CHAT = 'm_del_chat'
export const MENU_ADD_ADMIN = 'm_add_admin'
export const MENU_DEL_ADMIN = 'm_del_admin'
export const MENU_RULES = 'm_rules'
export const NULL = 'NULL'
export const COMMAND_MENU_CHOOSE_BD = 'm_choose_words'

export interface ICallback_query {
  u?: string
  c?: string
  d?: string
}

export interface ICommand {
  command: string
  command_value: string
}

export interface ITableChats {
  id?: number
  created_at: Date
  updated_at: Date
  chat_id: string
  title: string
  admins?: string
  root_admin_id: string
}

export interface ITableAdmin {
  id?: number
  created_at: Date
  updated_at: Date
  admin_id: string
  language_code: string
  first_name: string
  last_name: string
  username: string
  is_premium: boolean
  is_bot: boolean
}

export interface ITableRules {
  id?: number
  created_at?: Date
  updated_at?: Date
  chat_id?: string
  title?: string
  link_delete?: boolean
  personalDB_dictionary?: boolean
  generalDB_dictionary?: boolean
  generalFile_dictionary?: boolean
  user_block?: boolean
  notify_admin?: boolean
}

export interface ITableGeneralDictionary {
  id?: number
  created_at: Date
  updated_at: Date
  word: string
}

export interface ITableDictionary {
  id?: number
  created_at: Date
  updated_at: Date
  chat_id?: string
  word: string
}

export interface ITablePersonalDictionary {
  id?: number
  created_at: Date
  updated_at: Date
  chat_id: string
  word: string
}

export interface IUser {
  id?: number
  created_at?: Date
  updated_at?: Date
  admin_id: string
  language_code?: string
  first_name?: string
  last_name?: string
  username?: string
  is_premium?: boolean
  is_bot?: boolean
  command?: string
  command_value?: string
  title?: string
  type?: string
  is_automatic_forward?: boolean
  command_start?: boolean
  root_admin?: boolean
  super_root_admin?: boolean
}

export interface IChat {
  id?: number
  title?: string
  type?: string
}

export interface IConfigOptions {
  host: string
  port: string
  user: string
  database: string
  password: string
  token: string
  path_dictionary: string
  filename_dictionary: string
  secret: string
  bot_id: number
  owner_this_bot: string
}
