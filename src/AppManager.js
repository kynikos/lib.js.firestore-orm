// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {firebaseAdmin, DatabaseConnection} = require('./index')


module.exports = class AppManager {
  constructor(firebaseOptions) {
    this.app = firebaseAdmin.initializeApp(firebaseOptions)
    this.firestore = firebaseAdmin.firestore()
    // Be very careful with keeping references to the connections: it is going
    // to cause a memory leak if the connections aren't properly closed when
    // done
    // this.connections = []
  }

  connectDatabase(getCollectionSetup, structure, options, connectionData) {
    return new DatabaseConnection({
      appManager: this,
      getCollectionSetup,
      structure,
      options,
      connectionData,
    })
  }
}
