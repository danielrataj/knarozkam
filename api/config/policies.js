/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

const blueprintTokenPolicy = {
  find: 'token',
  findOne: 'token',
  create: 'token',
  update: 'token',
  destroy: 'token',
  populate: 'token',
  add: 'token',
  remove: 'token',
  replace: 'token',
}

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,

  DataTableController: blueprintTokenPolicy,
  AttachmentController: blueprintTokenPolicy
};
