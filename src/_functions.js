// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

/* eslint-disable max-lines */
const {CREATE, SET, UPDATE, deferredModules} = require('./index')


exports.makeStructure = function makeStructure(
  reference,
  subStructure,
  getSubRef,
) {
  if (subStructure == null) return null

  const structure = {}

  for (const [subRefName, subReference] of Object.entries(subStructure)) {
    structure[subRefName] = typeof subReference === 'function'
      ? (...args) => subReference(...args, reference)
      : getSubRef(subReference)
  }

  return structure
}


function matchSetup(setup, id) {
  if (setup.__match === true) return true
  if (setup.__match === id) return true
  if (typeof setup.__match === 'function') return setup.__match(id)
  if (
    setup.__match instanceof RegExp &&
    (typeof id === 'string' || id instanceof String)
  ) return setup.__match.test(id)
  return false
}


function resolveSetup(setups, id) {
  for (const setup of setups) {
    if (matchSetup(setup, id)) return setup
  }
  throw new Error(`Unexpected collection or document id: ${id}`)
}
exports.resolveSetup = resolveSetup


function getSubReference({baseRef, relPathSegments, setups, getSubRef}) {
  const [id, ...subPath] = [
    ...relPathSegments[0].split('/'),
    ...relPathSegments.slice(1),
  ]

  const setup = resolveSetup(setups, id)
  const subRef = setup.__makeFromId(baseRef, id)

  if (subPath.length) {
    return getSubRef(subRef, subPath)
  }

  return subRef
}


function getCollectionFromCollection(baseRef, relPathSegments) {
  return getSubReference({
    baseRef,
    relPathSegments,
    setups: baseRef.documentSetups,
    getSubRef: (document, subPath) => {
      return getCollectionFromDocument(document, subPath)
    },
  })
}


function getCollectionFromDocument(baseRef, relPathSegments) {
  return getSubReference({
    baseRef,
    relPathSegments,
    setups: baseRef.collectionSetups,
    getSubRef: (collection, subPath) => {
      return getDocumentFromCollection(collection, subPath)
    },
  })
}


function getDocumentFromCollection(baseRef, relPathSegments) {
  return getSubReference({
    baseRef,
    relPathSegments,
    setups: baseRef.documentSetups,
    getSubRef: (document, subPath) => {
      return getCollectionFromDocument(document, subPath)
    },
  })
}


function getDocumentFromDocument(baseRef, relPathSegments) {
  return getSubReference({
    baseRef,
    relPathSegments,
    setups: baseRef.collectionSetups,
    getSubRef: (collection, subPath) => {
      return getDocumentFromCollection(collection, subPath)
    },
  })
}


function getCollectionStructure(fromFn, baseRef, relPathSegments) {
  if (
    !relPathSegments.length ||
    (relPathSegments.length === 1 && !relPathSegments[0])
  ) {
    throw new Error('Invalid collection path')
  }

  const collection = fromFn(baseRef, relPathSegments)

  // The path may unexpectedly resolve to a document, not a collection, for
  // example if the resolved number of segments is even
  if (!(collection instanceof deferredModules.CollectionReference)) {
    throw new Error('The path resolves to a document, not a collection')
  }

  return collection.structure
}


function getDocumentStructure(fromFn, baseRef, relPathSegments) {
  if (
    !relPathSegments.length ||
    (relPathSegments.length === 1 && !relPathSegments[0])
  ) {
    throw new Error('Invalid document path; use docAutoId() to auto-generate ' +
      'a document ID')
  }

  const document = fromFn(baseRef, relPathSegments)

  // The path may unexpectedly resolve to a collection, not a document, for
  // example if the resolved number of segments is even
  if (!(document instanceof deferredModules.DocumentReference)) {
    throw new Error('The path resolves to a collection, not a document')
  }

  return document.structure
}


exports.getCollectionStructureFromCollection = function getCollectionStructureFromCollection(baseRef, relPathSegments) {
  return getCollectionStructure(
    getCollectionFromCollection,
    baseRef,
    relPathSegments,
  )
}


exports.getCollectionStructureFromDocument = function getCollectionStructureFromDocument(baseRef, relPathSegments) {
  return getCollectionStructure(
    getCollectionFromDocument,
    baseRef,
    relPathSegments,
  )
}


exports.getDocumentStructureFromCollection = function getDocumentStructureFromCollection(baseRef, relPathSegments) {
  return getDocumentStructure(
    getDocumentFromCollection,
    baseRef,
    relPathSegments,
  )
}


exports.getDocumentStructureFromDocument = function getDocumentStructureFromDocument(baseRef, relPathSegments) {
  return getDocumentStructure(
    getDocumentFromDocument,
    baseRef,
    relPathSegments,
  )
}


exports.createDocument = async function createDocument({
  docRef, data, batch, createFn,
}) {
  const serializedData = docRef.schema.serialize(data, {
    writeMode: CREATE,
    processMissingFields: true,
    onlyTheseFields: false,
  })

  const beforeData = docRef.database.__hooks.beforeCreatingDocument &&
    await docRef.database.__hooks.beforeCreatingDocument({
      document: docRef,
      serializedData,
      batch,
    })

  const writeResult = await createFn(serializedData)

  docRef.database.__hooks.afterCreatingDocument &&
    await docRef.database.__hooks.afterCreatingDocument({
      document: docRef,
      beforeData,
      serializedData,
      writeResult,
      batch,
    })

  // TODO: Return the native WriteResult object wrapped in a custom class with
  //       the serializedData?
  // return writeResult
  return serializedData
}


exports.deleteDocument = async function deleteDocument({
  docRef, precondition, batch, deleteFn,
}) {
  const beforeData = docRef.database.__hooks.beforeDeletingDocument &&
    await docRef.database.__hooks.beforeDeletingDocument({
      document: docRef,
      batch,
    })

  const writeResult = await deleteFn(precondition)

  docRef.database.__hooks.afterDeletingDocument &&
    await docRef.database.__hooks.afterDeletingDocument({
      document: docRef,
      beforeData,
      writeResult,
      batch,
    })

  // TODO: Return the native WriteResult object wrapped in a custom class?
  return writeResult
}


exports.setDocument = async function setDocument({
  docRef, data, options, batch, setFn,
}) {
  // TODO: Support options.mergeFields with FieldPath objects
  const sOptions = {
    writeMode: SET,
  }

  if (
    !options ||
    // XOR
    ((options.merge == null) === (options.mergeFields == null))
  ) {
    throw new Error("set() must explicitly specify either the 'merge' " +
      "or the 'mergeFields' option, not both or neither")
  } else if (options.mergeFields == null) {
    sOptions.processMissingFields = !options.merge
    sOptions.onlyTheseFields = false
  } else {
    sOptions.processMissingFields = true
    // TODO: Support FieldPath in onlyTheseFields
    sOptions.onlyTheseFields = options.mergeFields
  }

  const serializedData = docRef.schema.serialize(data, sOptions)

  const beforeData = docRef.database.__hooks.beforeSettingDocument &&
    await docRef.database.__hooks.beforeSettingDocument({
      document: docRef,
      serializedData,
      batch,
    })

  const writeResult = await setFn(serializedData, options)

  docRef.database.__hooks.afterSettingDocument &&
    await docRef.database.__hooks.afterSettingDocument({
      document: docRef,
      beforeData,
      serializedData,
      writeResult,
      batch,
    })

  // TODO: Return the native WriteResult object wrapped in a custom class with
  //       the serializedData?
  // return writeResult
  return serializedData
}


exports.updateDocument = async function updateDocument({
  docRef, dataOrField, preconditionOrValues, batch, updateFn,
}) {
  // TODO: Support dataOrField and preconditionOrValues with FieldPath objects
  // Disable 'processMissingFields' when updating, otherwise any unspecified
  // fields would be overwritten with their default values
  const serializedData = docRef.schema.serialize(dataOrField, {
    writeMode: UPDATE,
    processMissingFields: false,
    onlyTheseFields: false,
  })

  const beforeData = docRef.database.__hooks.beforeUpdatingDocument &&
    await docRef.database.__hooks.beforeUpdatingDocument({
      document: docRef,
      serializedData,
      batch,
    })

  const writeResult = await updateFn(serializedData, ...preconditionOrValues)

  docRef.database.__hooks.afterUpdatingDocument &&
    await docRef.database.__hooks.afterUpdatingDocument({
      document: docRef,
      beforeData,
      serializedData,
      writeResult,
      batch,
    })

  // TODO: Return the native WriteResult object wrapped in a custom class with
  //       the serializedData?
  // return writeResult
  return serializedData
}
