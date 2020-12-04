// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {CALL_DEFAULT_ALWAYS, FieldDateTime} = require('./index')


module.exports = class FieldDateTimeLastUpdate extends FieldDateTime {
  constructor(fieldName, options = {}) {
    super(fieldName, {
      onWriteNil: CALL_DEFAULT_ALWAYS,
      defaultWrite: (data, options_) => new Date(),
      ...options,
    })
  }
}
