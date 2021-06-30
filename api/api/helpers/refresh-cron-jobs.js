const { DateTime } = require('luxon')
const objectHash = require('object-hash')

module.exports = {

  friendlyName: 'Refresh all cronjobs.',

  description: '',

  inputs: {
  },

  exits: {
  },

  fn: async function (inputs, exits) {
    try {
      // clean queue first
      await sails.hooks.bull.mailer.empty()

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
          minute
        })

        const jobId = objectHash({
          sender,
          firstname,
          lastname,
          email,
          day,
          month,
          hour,
          minute,
          gender
        })

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
          jobId,
          cron: '0 0 1 1 *', // every year
          startDate
        })
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
