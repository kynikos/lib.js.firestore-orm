// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {FieldDateTime} = require('./_internal')


module.exports = class FieldDate extends FieldDateTime {
  serializeNotNull(value, {coerce = true}) {
    const sData = super.serializeNotNull(value, {coerce})
    return sData
  }

  deserialize(value) {
    return super.deserialize(value)
  }
}
