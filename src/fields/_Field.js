// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

module.exports = class Field {
  constructor(fieldName, options = {}) {
    const {
      required,
      nullable,
      default: default_,
      computeNoValue,
      computeNoValueOnly,
    } = options
    this.name = fieldName
    this.required = required == null ? true : Boolean(required)
    this.default = default_ == null ? null : default_
    this.nullable = nullable == null ? true : Boolean(nullable)
    this.computeNoValue = computeNoValue == null ? null : computeNoValue
    this.computeNoValueOnly = Boolean(computeNoValueOnly)
  }

  __serialize(value, options, data) {
    if (this.computeNoValueOnly) {
      throw new Error(`Field ${this.name} is computed dynamically, it rejects
        any explicitly assigned value`)
    }

    if (!this.nullable && value == null) {
      throw new Error(`Field ${this.name} requires a non-null value`)
    }

    // Possibly implement serializeNotNull() in subclasses
    return this.serializeNotNull(value, options, data)
  }

  // eslint-disable-next-line class-methods-use-this
  serializeNotNull(value, options, data) {
    // Let subclasses implement their own serializeNotNull()
    return value
  }

  __serializeNoValue(options, data) {
    if (this.computeNoValue) {
      const sData = this.computeNoValue(data, options)
      if (sData != null) return sData
    }

    if (this.required) {
      throw new Error(`Field ${this.name} requires a value, but none was given`)
    }

    return this.default
  }

  __deserialize(value, options, data) {
    // Possibly implement deserialize() in subclasses
    return this.deserialize(value, options, data)
  }

  // eslint-disable-next-line class-methods-use-this
  deserialize(value, options, data) {
    // Let subclasses implement their own deserialize()
    return value
  }

  __deserializeNoValue(options, data) {
    return this.default
  }
}
