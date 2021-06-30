const JSend = require('jsend')
const fs = require('fs')
const mimetype = require('mime-types')

module.exports = {

  friendlyName: 'Upload a file to temp dir.',

  inputs: {
    title: {
      type: 'string'
    },
    fd: {
      type: 'string'
    }
  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    },
    fileUploadError: {
      responseType: 'badRequest'
    }
  },

  fn: async function (inputs, exits) {
    console.log('JDJJD')

    if (inputs.fd) {
      if (!inputs.title) {
        inputs.title = inputs.fd
      }

      const buff = fs.readFileSync(inputs.fd)
      const base64data = buff.toString('base64')
      const mime = mimetype.lookup(inputs.fd)
      const extension = mimetype.extension(mime)

      try {
        const result = await Attachment.create({
          title: inputs.title,
          content: `data:${mime};base64,${base64data}`,
          mime,
          extension
        }).meta({ fetch: true })

        // upload done, finish process
        return exits.success(JSend.success(result))
      } catch (error) {
        if (error) {
          sails.log.error(error)
        }

        return exits.badRequest()
      }
    }

    // do the upload
    this.req.file('file').upload(async (err, files) => {
      if (err) {
        return exits.fileUploadError()
      }

      if (!files.length) {
        return exits.fileUploadError()
      }

      const file = files[0]

      return exits.success(JSend.success({
        fd: file.fd
      }))
    })
  }
}
