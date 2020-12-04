// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {IGNORE, CALL_DEFAULT_ALWAYS, ABORT, FieldDateTime} = require('./index')


module.exports = class FieldDateTimeCreation extends FieldDateTime {
  constructor(fieldName, options = {}) {
    super(fieldName, {
      onWrite: ABORT,
      onCreateNil: CALL_DEFAULT_ALWAYS,
      onSetNil: IGNORE,
      onUpdateNil: IGNORE,
      defaultWrite: (data, options_) => new Date(),
      ...options,
    })
  }
}
