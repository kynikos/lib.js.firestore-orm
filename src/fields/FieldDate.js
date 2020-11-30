// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {FieldDateTime} = require('./index')


module.exports = class FieldDate extends FieldDateTime {
  serializeNotNull(value, {coerce = true}, data) {
    const sData = super.serializeNotNull(value, {coerce}, data)
    return sData
  }

  deserialize(value, options, data) {
    return super.deserialize(value, options, data)
  }
}
