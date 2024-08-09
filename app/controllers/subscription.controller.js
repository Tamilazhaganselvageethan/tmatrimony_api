//var account = require('../models/account.model.js');
//const account = require('mongoose').model('Account')
const express = require('express')
//const identifyingKey = 'reference'

exports.addCachingKey = function (req, res, next) {
  getCacheProvider().setKeyOnResponse(res, get(req, 'crudify.account.reference'))
  next()
}

// const updatePartialSubscription = async function (req, res, next) {
//   processAndRespond(res, new Promise(async (resolve, reject) => {
//     try {
//       const query = { reference: req.params.accountReference }
//       const results = Account.update(query, { $set: req.body }, { upsert: true })
//       getCacheProvider().purgeContentByKey(req.params.accountReference)
//       resolve(results)
//     } catch (err) {
//       reject(err)
//     }
//   }))
// }

// Public API

// Basic implementations for illustration
exports.account = getCacheProvider = () => ({
  setKeyOnResponse: (res, key) => { /* Logic to set cache key */ },
  purgeContentByKey: (key) => { /* Logic to purge cache by key */ }
});

exports.account =processAndRespond = (res, promise) => {
  promise
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }));
};

exports.account = sendRequestResponse = (req, res) => {
  res.status(200).json(res.locals.data || {});
};


  // const router = express.Router()
  // app.use('/', router)

  // router.patch('/api/accounts/:accountReference', updatePartialSubscription)

