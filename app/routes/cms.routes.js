module.exports = app => {
  const cms = require("../controllers/cms.controller.js");
  var router = require("express").Router();

  router.get("/:page_sku", cms.index); 
  
  app.use('/api/v1.0/cms', router);
};