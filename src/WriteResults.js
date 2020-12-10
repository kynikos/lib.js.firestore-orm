// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE


module.exports = class WriteResults {
  constructor({__fsWriteResults, serializedData}) {
    this.__fsWriteResults = __fsWriteResults
    this.writeTime = __fsWriteResults.writeTime
    this.serializedData = serializedData
  }

  isEqual(other) {
    return this.__fsWriteResults.isEqual(other)
  }
}
