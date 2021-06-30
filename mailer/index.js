require( 'console-stamp' )( console )
const Queue = require('bull')
const logSymbols = require('log-symbols')
const packageJson = require('./package.json')
const packageName = packageJson.name
const nodemailer = require('nodemailer')

const mailerQueue = new Queue('mailer', {
  redis: {
    host: process.env.APP_REDIS_HOST,
    port: process.env.APP_REDIS_PORT,
    password: process.env.APP_REDIS_PASSWORD
  }
})

mailerQueue.process(async (job, done) => {
  console.error(`[${packageName}] [${logSymbols.info}] [START]`, 'Processing mail from queue.')

  const data = job.data

  const transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT
  })

  let attachments = []

  if (data.attachment) {
    console.error(`[${packageName}] [${logSymbols.info}]`, 'Adding attachment.')
    attachments.push(
      {
        filename: `${data.firstname} ${data.lastname}.${data.attachmentExtension}`,
        path: data.attachment
      }
    )
  }

  try {
    console.error(`[${packageName}] [${logSymbols.info}]`, `Sending mail to ${data.email} from ${data.sender}.`)
    await transporter.sendMail({
      from: data.sender,
      to: data.email,
      subject: data.subject,
      html: `
      ${data.salutation}<br>
      ${data.text}<br><br><br>
      ${data.signature}
      `,
      attachments
    })
    console.error(`[${packageName}] [${logSymbols.info}]`, 'Mail successfully sent.')
  } catch (error) {
    console.error(`[${packageName}] [${logSymbols.error}]`, 'Mail not sent.')
    if (error) {
      console.error(`[${packageName}] [${logSymbols.error} ${logSymbols.error} ${logSymbols.error}]`, error)
    }
  }

  return done()
})

mailerQueue.on('completed', async (job) => {
  console.error(`[${packageName}] [${logSymbols.info}] [DONE]`, 'Processing mail from queue.')
})

mailerQueue.on('error', async (error) => {
  console.error(`[${packageName}] [${logSymbols.error} ${logSymbols.error} ${logSymbols.error}]`, error)
})

mailerQueue.on('failed', async (job, error) => {
  console.error(`[${packageName}] [${logSymbols.error}]`, error.stdout || error.stderr || error)
})
