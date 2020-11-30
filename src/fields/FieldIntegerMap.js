// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {FieldInteger} = require('./index')


module.exports = class FieldIntegerMap extends FieldInteger {
  serializeNotNull(value, {coerce = true}, data) {
    const sData = Object.entries(value).reduce((acc, [key, val]) => {
      acc[key] = super.serializeNotNull(val, {coerce}, data)
      return acc
    }, {})

    return sData
  }
}
