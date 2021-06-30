const fs = require('fs')
const cron = require('node-cron')
/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function (done) {
  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return done();
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  // create a temporary folder if not exists
  if (!fs.existsSync(sails.config.paths.public)) {
    fs.mkdirSync(sails.config.paths.public, {
      recursive: true
    })
  }

  // scan for all cronjobs in every 30 seconds
  cron.schedule('* * * * *', async () => {
    sails.log('[update-cron-jobs] Run cronjob to setup repeating jobs.')
    // do something useful every minute

    await sails.helpers.refreshCronJobs()
  })

  await sails.helpers.refreshCronJobs()

  // initiate datatable with users
  const datatableResults = await DataTable.find({})

  if (!datatableResults.length) {
    await DataTable.create({
      version: 1
    })
  }

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done()
}