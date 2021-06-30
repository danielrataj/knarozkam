module.exports = {

  friendlyName: 'Overall status for the app.',

  description: '',

  inputs: {
  },

  exits: {
  },

  fn: async function (inputs, exits) {
    let overall = {
      issues: 0,
      output: []
    }

    try {
    } catch (error) {
      if (error) {
        sails.log.error(error)
        // error is not interesting here
      }

      // something is cardinally wrong
      overall.issues = 1000
      overall.output.push('Internal Server Error.')
    }


    return exits.success(overall)
  }
}
