module.exports = app => {
  const master = require("../controllers/master.controller.js");
  var router = require("express").Router();

  router.get("/caste", master.caste);
  router.get("/citizen", master.citizenship);
  router.get("/city", master.city);
  router.get("/country", master.country);
  router.get("/district", master.district);
  router.get("/education_type", master.educationType)
  router.get("/education", master.education);
  router.get("/eduinstitution", master.educationInstitution);
  router.get("/eduuniversity", master.educationUniversity);
  router.get("/employment_type", master.employmentType);
  router.get("/gothram", master.gothram);
  router.get("/higher_education", master.higherEducation);
  router.get("/hobbies", master.hobbies);
  router.get("/income", master.income);
  router.get("/lang", master.languages);
  router.get("/natchra", master.natchra);
  router.get("/occupation", master.occupation);
  router.get("/rasi", master.rasi);
  router.get("/religion", master.religion);
  router.get("/state", master.state);
  router.get("/subcaste", master.subcaste);
  router.get('/education_by_type', master.getEducationByType);

  router.get('/countries', master.getCountries);
  router.get('/states_by_country', master.getStatesByCountry);
  router.get('/districts_by_state', master.getDistrictsByState);
  router.get('/taluks_by_district', master.getTaluksByDistrict);
  app.use('/api/v1.0/master', router);
};