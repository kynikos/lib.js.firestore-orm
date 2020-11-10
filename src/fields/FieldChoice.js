// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {Field} = require('./index')


module.exports = class FieldChoice extends Field {
  constructor(fieldName, options = {}) {
    const {choices, ...commonOptions} = options
    if (!choices || !Array.isArray(choices)) {
      throw new Error("'choices' is required and must be an Array")
    }
    super(fieldName, commonOptions)
    this.choices = choices
  }

  serializeNotNull(value, {coerce = true}) {
    const sData = value

    if (!(this.choices.includes(sData))) {
      throw new Error(`Value for ${this.name} is not among the allowed choices`)
    }

    return sData
  }

  deserialize(value) {
    return value
  }
}
