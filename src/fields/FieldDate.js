// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {FieldDateTime} = require('./index')


module.exports = class FieldDate extends FieldDateTime {
  serializeNotNull(value, {coerce = true}, data) {
    const sData = super.serializeNotNull(value, {coerce}, data)
    sData.setUTCHours(0, 0, 0, 0)
    // TODO: Verify that 'value' is a simple date, possibly coerce
    return sData
  }

  deserialize(value, options, data) {
    // TODO: Only return a date
    // Make sure to return a timezone-agnostic string (i.e. not UTC), otherwise
    // clients in Western time zones may derive the previous date
    return super.deserialize(value).toISOString().slice(0, 10)
  }
}
