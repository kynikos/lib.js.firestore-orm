// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE


module.exports = function FieldMapMixin(Field) {
  return class extends Field {
    serializeNotNull(value, options, data) {
      // TODO: Verify that 'value' is an object literal
      const sData = Object.entries(value).reduce((acc, [key, val]) => {
        acc[key] = super.serializeNotNull(val, options, data)
        return acc
      }, {})

      return sData
    }

    deserialize(value, options, data) {
      return value && Object.entries(value).reduce((acc, [key, val]) => {
        acc[key] = super.deserialize(val, options, data)
        return acc
      }, {})
    }
  }
}
