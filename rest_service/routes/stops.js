
var express = require('express');
var router = express.Router();

var stopModel = require('../models/stop')

/* GET users listing. */
router.get('/', stopModel.getStops, function(req, res, next) {
  res.json(res.results);
});

router.get('/:stopId', function(req, res, next){
  req.params.stopId = parseInt(req.params.stopId, 10)
  if (req.params.stopId){
    next()
  } else {
    next({'code':404,'message':'parameter should be a number'})
  }
}, stopModel.getSpecificStop, function(req, res, next) {
  res.json(res.results);
});

router.post('/', function(req, res, next) {
  if (req.body.nextTo && req.body.nextTo.coordinates && req.body.nextTo.coordinates.length == 2){
    req.body.limit = (req.body.limit ? req.body.limit : 3)
    next()
  } else{
    next({'code':520,'message': 'syntax error ' + req.body})
  }
},stopModel.getStopsNextBy,  function(req, res, next) {
  res.json(res.results);
});
module.exports = router;
