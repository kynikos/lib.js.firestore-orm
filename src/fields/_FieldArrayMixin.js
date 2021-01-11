// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE


module.exports = function FieldArrayMixin(Field) {
  return class extends Field {
    serializeNotNull(value, options, data) {
      if (!Array.isArray(value)) {
        throw new Error(`Value for ${this.name} is not an Array`)
      }

      const sData = value.map((item) => {
        return super.serializeNotNull(item, options, data)
      })

      return sData
    }

    deserialize(value, options, data) {
      return value &&
        value.map((item) => super.deserialize(item, options, data))
    }
  }
}
