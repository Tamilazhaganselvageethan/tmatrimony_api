module.exports = app => {
    const subscription = require("../controllers/subscription.controller.js");
    var router = require("express").Router();
  
    router.get("/account", subscription.account);
}