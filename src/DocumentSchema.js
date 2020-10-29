// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

module.exports = class DocumentSchema {
  constructor(...fields) {
    this.fields = fields
  }

  __iterateFields({
    data, handleFound, handleNotFound, onlyTheseFields, ignoreExtraneousFields,
  }) {
    const cData = {...data}

    const sData = this.fields.reduce(
      (acc, field) => {
        if (field.name in cData) {
          acc[field.name] = handleFound(field, cData[field.name])
          delete cData[field.name]
        } else if (
          handleNotFound &&
          (!onlyTheseFields || onlyTheseFields.includes(field.name))
        ) {
          acc[field.name] = handleNotFound(field)
        }
        return acc
      },
      {},
    )

    if (!ignoreExtraneousFields && Object.keys(cData).length > 0) {
      throw new Error(`Extraneous field names:
        ${Object.keys(cData).join(', ')}`)
    }

    return sData
  }

  serialize(data, options = {}) {
    const {
      ignoreAllMissingFields = false,
      onlyTheseFields = false,
      ignoreExtraneousFields = false,
      ...fieldOptions
    } = options

    return this.__iterateFields({
      data,
      handleFound: (field, value) => {
        return field.serialize(value, fieldOptions)
      },
      handleNotFound: !ignoreAllMissingFields && ((field) => {
        return field.serializeNoValue(fieldOptions)
      }),
      onlyTheseFields,
      ignoreExtraneousFields,
    })
  }

  deserialize(data, options = {}) {
    const {
      fillWithDefaults = false,
      onlyTheseFields = false,
      ignoreExtraneousFields = false,
      ...fieldOptions
    } = options

    return this.__iterateFields({
      data,
      handleFound: (field, value) => {
        return field.deserialize(value, fieldOptions)
      },
      handleNotFound: fillWithDefaults && ((field) => {
        return field.deserializeNoValue(fieldOptions)
      }),
      onlyTheseFields,
      ignoreExtraneousFields,
    })
  }
}
