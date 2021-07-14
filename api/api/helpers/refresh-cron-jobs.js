const { DateTime } = require('luxon')
// const cronParser = require('cron-parser')

module.exports = {

  friendlyName: 'Refresh all cronjobs.',

  description: '',

  inputs: {
  },

  exits: {
  },

  fn: async function (_, exits) {
    try {
      // clean queue first
      const jobs = await sails.hooks.bull.mailer.getRepeatableJobs()
      await Promise.all(jobs.map(j => sails.hooks.bull.mailer.removeRepeatableByKey(j.key)))

      const datatable = await DataTable.findOne({
        version: 1
      })

      if (!datatable.data || !datatable.data.length) {
        return exits.success(true)
      }

      const rows = JSON.parse(datatable.data)

      for (const row of rows) {
        const sender = row[0]
        const firstname = row[1]
        const lastname = row[2]
        const email = row[3]
        const day = row[4]
        const month = row[5]
        const hour = row[6] || 0
        const minute = row[7] || 0
        const gender = row[8]
        const subject = row[9]
        const salutation = row[10]
        const text = row[11]
        const signature = row[12]

        // something is missing, hour or minute might be "0"
        if (!sender || !firstname || !lastname || !email || !day || !month || !gender || !subject || !salutation || !text || !signature) {
          continue
        }

        // get base64 attachment
        const attachment = await Attachment.findOne({
          title: row[13]
        })

        let attachmentContent = ''
        let attachmentExtension = ''

        if (attachment) {
          attachmentContent = attachment.content
          attachmentExtension = attachment.extension
        }

        const startDate = DateTime.fromObject({
          day,
          month,
          hour,
          minute,
          zone: 'Europe/Prague'
        })

        const nowDate = DateTime.now().setZone('Europe/Prague')
        const diff = startDate.diff(nowDate)

        sails.log(`[START] Adding mail to queue. From: ${sender}, to ${email}.`)

        // diff is lower, skip
        if (diff.milliseconds < 0) {
          sails.log(`[END] No need to put the email to queue because it happened in the past. From: ${sender}, to ${email}.`)
          continue
        }

        await sails.hooks.bull.mailer.add({
          sender,
          firstname,
          lastname,
          email,
          day,
          month,
          hour,
          minute,
          gender,
          subject,
          salutation,
          text,
          signature,
          attachment: attachmentContent,
          attachmentExtension
        }, {
          delay: diff.milliseconds
        })

        sails.log(`[END] Adding mail to queue. From: ${sender}, to ${email}.`)
      }
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }

      return exits.success(false)
    }

    return exits.success(true)
  }
}
