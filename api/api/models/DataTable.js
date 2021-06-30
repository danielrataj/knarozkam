/**
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    version: {
      type: 'number',
      required: true
    },
    data: {
      type: 'string'
    }
  }
}