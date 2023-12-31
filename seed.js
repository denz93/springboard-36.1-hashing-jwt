const db = require('./db')
const User = require('./models/user')

const {faker} = require('@faker-js/faker');
const {hash} = require('bcrypt');
const { BCRYPT_WORK_FACTOR } = require('./config');
const Message = require('./models/message');

async function genUsers(batchSize=10) {
  const users = []
  for (let i = 0; i < batchSize; i++) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    users.push({
      username: faker.internet.userName({firstName, lastName}).toLowerCase(),
      password: await hash(faker.internet.password(), BCRYPT_WORK_FACTOR),
      first_name: firstName,
      last_name: lastName,
      phone: faker.phone.number(),
    })
  }
  return users
}

/**
 * 
 * @param {ReturnType<genUsers>} users 
 */
async function populateUsers(users) {
  let success = 0;
  for (const user of users) {
    try {
      await User.register(user)
      success++
    } catch(err) {
      console.log(err)
    }
  }
  console.log(`Populated ${success}/${users.length} users`)
}

async function genMessagesTo(username, batchSize=10) {
  const messages = []
  for (let i = 0; i < batchSize; i++) {
    const msg = {
      from_username: 'demo',
      to_username: username,
      body: faker.lorem.sentences(),
    }
    messages.push(msg)
  }
  return messages
}

async function genMessagesFrom(username, batchSize=10) {
  const messages = []
  for (let i = 0; i < batchSize; i++) {
    const msg = {
      from_username: username,
      to_username: 'demo',
      body: faker.lorem.sentences(),
    }
    messages.push(msg)
  }
  return messages
}

/**
 * 
 * @param {ReturnType<genMessagesFrom>} messages 
 */
async function populateMessages(messages) {
  for (let msg of messages) {
    await Message.create(msg)
  }
}


async function main() {
  const users = await genUsers(5)
  await populateUsers(users)

  const messagesTo = await genMessagesTo(users[0].username)
  await populateMessages(messagesTo)
  const messagesFrom = await genMessagesFrom(users[0].username)
  await populateMessages(messagesFrom)
  process.exit(1)
}

main()