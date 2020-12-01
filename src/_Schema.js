// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

module.exports = class _Schema {
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
        return field.__serialize(value, fieldOptions, data)
      },
      handleNotFound: !ignoreAllMissingFields && ((field) => {
        return field.__serializeNoValue(fieldOptions, data)
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
        return field.__deserialize(value, fieldOptions, data)
      },
      handleNotFound: fillWithDefaults && ((field) => {
        return field.__deserializeNoValue(fieldOptions, data)
      }),
      onlyTheseFields,
      ignoreExtraneousFields,
    })
  }

  deserializeField(fieldName, value, data, fieldOptions) {
    return this.fields[fieldName].__deserialize(value, fieldOptions, data)
  }
}
