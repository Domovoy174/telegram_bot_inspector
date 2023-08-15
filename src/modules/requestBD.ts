import msq from 'knex'
import { ICommand, ITableChats, ITableRules } from '../global.js'
import { IUser } from '../global.js'
import { configOptions } from '../index.js'
import { logger } from './logger.js'
const { Knex, knex } = msq

const knexConfig: msq.Knex.Config = {
  client: 'mysql',
  connection: {
    host: configOptions?.host,
    port: Number(configOptions?.port),
    user: configOptions?.user,
    password: configOptions?.password,
    database: configOptions?.database,
  },
}

export const dbConnection = knex(knexConfig)

export async function checkingTables(db: msq.Knex) {
  try {
    const chats = await db.schema.hasTable('chats').then(function (exists) {
      if (!exists) {
        return db.schema.createTable('chats', function (table) {
          table.increments()
          table.timestamps()
          table.string('chat_id')
          table.string('title')
          table.string('root_admin_id')
          table.string('admins')
        })
      }
    })

    const admins = await db.schema.hasTable('users').then(function (exists) {
      if (!exists) {
        return db.schema.createTable('users', function (table) {
          table.increments()
          table.timestamps()
          table.string('admin_id')
          table.string('first_name')
          table.string('last_name')
          table.string('username')
          table.string('language_code')
          table.string('type')
          table.string('command')
          table.string('command_value')
          table.boolean('is_premium')
          table.boolean('is_bot')
          table.boolean('command_start')
          table.boolean('root_admin')
          table.boolean('super_root_admin')
          table.boolean('is_automatic_forward')
        })
      }
    })

    const rules = await db.schema.hasTable('rules').then(function (exists) {
      if (!exists) {
        return db.schema.createTable('rules', function (table) {
          table.increments()
          table.timestamps()
          table.string('chat_id')
          table.boolean('user_block')
          table.boolean('link_delete')
          table.boolean('notify_admin')
          table.boolean('personalDB_dictionary')
          table.boolean('generalDB_dictionary')
          table.boolean('generalFile_dictionary')
        })
      }
    })

    const generalDBDictionary = await db.schema
      .hasTable('generalDBDictionary')
      .then(function (exists) {
        if (!exists) {
          return db.schema.createTable('generalDBDictionary', function (table) {
            table.increments()
            table.timestamps()
            table.string('word')
          })
        }
      })

    const personalDBDictionary = await db.schema
      .hasTable('personalDBDictionary')
      .then(function (exists) {
        if (!exists) {
          return db.schema.createTable(
            'personalDBDictionary',
            function (table) {
              table.increments()
              table.timestamps()
              table.string('chat_id')
              table.string('word')
            }
          )
        }
      })

    return true
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function checkingTables',
      additional: error,
    })
    return `Error checkingTables ${error} `
  }
}

export async function findChats(id: string, db: msq.Knex) {
  try {
    const data = await db
      .select('*')
      .from('chats')
      .where({ chat_id: id })
      .then(function (rows) {
        return rows
      })
    if (data && data.length > 0) return data[0]
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function findChats',
      additional: error,
    })
  }
  return undefined
}

export async function findOneChat(
  root_admin_id: string,
  chat_id: string,
  db: msq.Knex
) {
  try {
    const data = await db
      .select('*')
      .from('chats')
      .where({ root_admin_id })
      .where({ chat_id })
      .then(function (rows) {
        return rows
      })
    if (data && data.length > 0) return data
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function findOneChat',
      additional: error,
    })
  }
  return []
}

export async function find(chat_id: string, db: msq.Knex) {
  try {
    const data = await db
      .select('*')
      .from('chats')
      .where({ chat_id })
      .then(function (rows) {
        return rows
      })
    if (data && data.length > 0) return data
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function find',
      additional: error,
    })
  }
  return []
}

export async function findChatsWithRootAdmin(
  root_admin_id: string,
  db: msq.Knex
) {
  try {
    const data = await db
      .select('*')
      .from('chats')
      .where({ root_admin_id })
      .then(function (rows) {
        return rows
      })
    if (data && data.length > 0) return data
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function findChatsWithRootAdmin',
      additional: error,
    })
  }
  return []
}

export async function findRules(id: string, db: msq.Knex) {
  try {
    const data = await db
      .select('*')
      .from('rules')
      .where({ chat_id: id })
      .then(function (rows) {
        return rows
      })
    if (data && data.length > 0) return data[0]
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function findRules',
      additional: error,
    })
  }
  return undefined
}

export async function personalDBDictionary(id: string, db: msq.Knex) {
  try {
    const data = await db
      .select('*')
      .from('personalDBDictionary')
      .where({ chat_id: id })
      .then(function (rows) {
        return rows
      })
    let words: string[] = []
    if (data && data.length > 0) {
      for (let item of data) {
        words.push(item.word)
      }
    }
    return words
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function personalDBDictionary',
      additional: error,
    })
  }
}

export async function generalDBDictionary(db: msq.Knex) {
  try {
    const data = await db
      .select('*')
      .from('generalDBDictionary')
      .then(function (rows) {
        return rows
      })
    let words: string[] = []
    if (data && data.length > 0) {
      for (let item of data) {
        words.push(item.word)
      }
    }
    return words
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function generalDBDictionary',
      additional: error,
    })
  }
}

export async function generalDBDictionaryObject(db: msq.Knex) {
  try {
    const data = await db
      .select('*')
      .from('generalDBDictionary')
      .then(function (rows) {
        return rows
      })
    if (data && data.length > 0) return data
    return []
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function generalDBDictionaryObject',
      additional: error,
    })
  }
}

export async function personalDBDictionaryObject(id: string, db: msq.Knex) {
  try {
    const data = await db
      .select('*')
      .from('personalDBDictionary')
      .where({ chat_id: id })
      .then(function (rows) {
        return rows
      })
    if (data && data.length > 0) return data
    return []
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function personalDBDictionaryObject',
      additional: error,
    })
  }
}

export async function saveChat(chat: ITableChats, db: msq.Knex) {
  try {
    const data = await db('chats').insert(chat)
    return data
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function saveChat',
      additional: error,
    })
  }
}

export async function updateAdmins(
  chat_id: string,
  admins: string,
  db: msq.Knex
) {
  try {
    const data = await db('chats').where({ chat_id }).update({
      admins,
    })
    return data
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function updateAdmins',
      additional: error,
    })
  }
}

export async function deleteChatFromRootAdmin(
  chat_id: string,
  root_admin_id: string,
  db: msq.Knex
) {
  try {
    const data = await db('chats')
      .where('chat_id', chat_id)
      .where('root_admin_id', root_admin_id)
      .del()
    return data
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function deleteChatFromRootAdmin',
      additional: error,
    })
  }
}

export async function findUserInTableUsers(admin_id: string, db: msq.Knex) {
  try {
    const result = await db.select('*').from('users').where({ admin_id })
    if (result && result.length > 0) return result[0]
    return []
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function findUserInTableUsers',
      additional: error,
    })
    return undefined
  }
}

export async function saveNewUser(user: IUser, db: msq.Knex) {
  try {
    const result = await db('users').insert(user)
    return result
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function saveNewUser',
      additional: error,
    })
    return undefined
  }
}

export async function editCommandForUser(
  admin_id: string,
  command: ICommand,
  db: msq.Knex
) {
  try {
    const data = await db('users').where({ admin_id }).update({
      updated_at: new Date(),
      command: command.command,
      command_value: command.command_value,
    })
    return data
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function editCommandForUser',
      additional: error,
    })
  }
}

export async function findRulesForChat(chat_id: string, db: msq.Knex) {
  try {
    const data = await db
      .select('*')
      .from('rules')
      .where({ chat_id })
      .then(function (rows) {
        return rows
      })
    if (data && data.length > 0) return data
    return []
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function findRulesForChat',
      additional: error,
    })
  }
}

export async function createRulesForChat(
  chat_id: string,
  data_rules: ITableRules,
  db: msq.Knex
) {
  try {
    const result = await db('rules').insert(data_rules)
    return result
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function createRulesForChat',
      additional: error,
    })
    return undefined
  }
}

export async function deleteRulesFromChat(chat_id: string, db: msq.Knex) {
  try {
    const data = await db('rules').where('chat_id', chat_id).del()
    return data
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function deleteRulesFromChat',
      additional: error,
    })
  }
}

export async function updateOneRule(
  chat_id: string,
  rule_name: string,
  rule: boolean,
  db: msq.Knex
) {
  try {
    const data = await db('rules')
      .where({ chat_id })
      .update(`${rule_name}`, rule)
      .update(`updated_at`, new Date())
    return data
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function updateOneRule',
      additional: error,
    })
  }
}

export async function updateUserToSuperRoot(
  admin_id: string,
  command_start: boolean,
  super_root_admin: boolean,
  db: msq.Knex
) {
  try {
    const data = await db('users')
      .where({ admin_id })
      .update(`command_start`, command_start)
      .update(`super_root_admin`, super_root_admin)
      .update(`updated_at`, new Date())
    return data
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function updateUserToSuperRoot',
      additional: error,
    })
  }
}

export async function updateUserToRootAdmin(
  admin_id: string,
  command_start: boolean,
  root_admin: boolean,
  db: msq.Knex
) {
  try {
    const data = await db('users')
      .where({ admin_id })
      .update(`command_start`, command_start)
      .update(`root_admin`, root_admin)
      .update(`updated_at`, new Date())
    return data
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function updateUserToRootAdmin',
      additional: error,
    })
  }
}

export async function findUsersWithCommandStart(db: msq.Knex) {
  try {
    const result = await db
      .select('*')
      .from('users')
      .where({ command_start: true })
    if (result && result.length > 0) return result
    return []
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function findUsersWithCommandStart',
      additional: error,
    })
    return []
  }
}

export async function findUsersRootAdmin(db: msq.Knex) {
  try {
    const result = await db
      .select('*')
      .from('users')
      .where({ root_admin: true })
    if (result && result.length > 0) return result
    return []
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function findUsersRootAdmin',
      additional: error,
    })
    return []
  }
}

export async function findWordInPersonalDB(
  word: string,
  chat_id: string,
  db: msq.Knex
) {
  try {
    const data = await db
      .select('*')
      .from('personalDBDictionary')
      .where({ chat_id })
      .where({ word })
      .then(function (rows) {
        return rows
      })
    if (data && data.length > 0) return data
    return []
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function findWordInPersonalDB',
      additional: error,
    })
  }
}

export async function findWordInGeneralDB(word: string, db: msq.Knex) {
  try {
    const data = await db
      .select('*')
      .from('generalDBDictionary')
      .where({ word })
      .then(function (rows) {
        return rows
      })
    if (data && data.length > 0) return data
    return []
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function findWordInGeneralDB',
      additional: error,
    })
  }
}

export async function createNewWordInPersonalDB(
  chat_id: string,
  word: string,
  db: msq.Knex
) {
  try {
    const result = await db('personalDBDictionary').insert({
      created_at: new Date(),
      updated_at: new Date(),
      chat_id,
      word,
    })
    return result
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function createNewWordInPersonalDB',
      additional: error,
    })
    return undefined
  }
}

export async function createNewWordInGeneralDB(word: string, db: msq.Knex) {
  try {
    const result = await db('generalDBDictionary').insert({
      created_at: new Date(),
      updated_at: new Date(),
      word,
    })
    return result
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function createNewWordInGeneralDB',
      additional: error,
    })
    return undefined
  }
}

export async function deleteWordInPersonalDB(
  word: string,
  chat_id: string,
  db: msq.Knex
) {
  try {
    const data = await db('personalDBDictionary')
      .where({ chat_id })
      .where({ word })
      .del()
    return data
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function deleteWordInPersonalDB',
      additional: error,
    })
  }
}

export async function deleteWordInGeneralDB(word: string, db: msq.Knex) {
  try {
    const data = await db('generalDBDictionary').where({ word }).del()
    return data
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function deleteWordInGeneralDB',
      additional: error,
    })
  }
}

export async function findSuperRootAdmin(db: msq.Knex) {
  try {
    const result = await db
      .select('*')
      .from('users')
      .where({ super_root_admin: true })
    if (result && result.length > 0) return result
    return []
  } catch (error) {
    logger.error({
      date: new Date(),
      message: 'module requestBD.ts function  findSuperRootAdmin',
      additional: error,
    })
    return []
  }
}
