// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {Field} = require('./index')


module.exports = class FieldJson extends Field {
  serializeNotNull(value, options, data) {
    return JSON.stringify(value)
  }

  deserialize(value, options, data) {
    return JSON.parse(value)
  }
}
