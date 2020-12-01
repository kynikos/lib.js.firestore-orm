// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

module.exports = class DocumentSchema {
  constructor(...fields) {
    this.fields = fields.reduce((acc, field) => {
      if (field.name in acc) {
        throw new Error(`Duplicated field name: ${field.name}`)
      }
      acc[field.name] = field
      return acc
    }, {})
  }

  __iterateFields({
    data, handleFound, handleNotFound, onlyTheseFields, ignoreExtraneousFields,
  }) {
    const cData = {...data}

    const sData = Object.values(this.fields).reduce(
      (acc, [field]) => {
        if (field.name in cData) {
          acc[field.name] = handleFound(field, cData[field.name], cData)
          delete cData[field.name]
        } else if (
          handleNotFound &&
          (!onlyTheseFields || onlyTheseFields.includes(field.name))
        ) {
          acc[field.name] = handleNotFound(field, cData)
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
      handleFound: (field, value, cData) => {
        return field.__serialize(value, fieldOptions, cData)
      },
      handleNotFound: !ignoreAllMissingFields && ((field, cData) => {
        return field.__serializeNoValue(fieldOptions, cData)
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
      handleFound: (field, value, cData) => {
        return field.__deserialize(value, fieldOptions, cData)
      },
      handleNotFound: fillWithDefaults && ((field, cData) => {
        return field.__deserializeNoValue(fieldOptions, cData)
      }),
      onlyTheseFields,
      ignoreExtraneousFields,
    })
  }

  deserializeField(fieldName, value, data, fieldOptions) {
    return this.fields[fieldName].__deserialize(value, fieldOptions, data)
  }
}
