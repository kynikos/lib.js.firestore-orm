// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {_Schema} = require('../index')
const {Field} = require('./index')


module.exports = class FieldSchema extends Field {
  constructor(fieldName, options = {}) {
    const {fields, ...commonOptions} = options
    super(fieldName, commonOptions)
    this.schema = new _Schema(...fields)
  }

  serializeNotNull(value, options, data) {
    return this.schema.serialize(value, options, data)
  }

  deserialize(value, options, data) {
    return this.schema.deserialize(value, options, data)
  }
}
