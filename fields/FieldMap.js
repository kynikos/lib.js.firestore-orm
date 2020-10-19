// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const Field = require('./_Field')


module.exports = class FieldMap extends Field {
  serializeNotNull(value) {
    const sData = value
    return sData
  }

  deserialize(value) {
    return value
  }
}
