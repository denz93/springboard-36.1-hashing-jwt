const { TWILIO_ACCOUNTSID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER } =require("../config");

const twilio = require("twilio");
const client = twilio(TWILIO_ACCOUNTSID, TWILIO_AUTH_TOKEN)
/**
 * Sends an SMS message to a specified recipient.
 *
 * @param {string} to - The phone number of the recipient.
 * @param {string} message - The content of the message to be sent.
 * @return {void} This function does not return anything.
 */
async function sendSMS(to, message) {
  try {
    const msg = await client.messages.create({
      to,
      from: TWILIO_NUMBER,
      body: message,
    })

    if (msg.errorCode) {
      console.error(`Failed to send a msg`)
      console.error(msg.errorMessage)
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  sendSMS
}