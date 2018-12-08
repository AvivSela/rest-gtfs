var express = require('express');
var router = express.Router();
var stopModel = require('../models/stop')

/* GET users listing. */
router.get('/',
  stopModel.getStops,
  function (req, res, next) {
    res.json(res.results);
  }
);

router.get('/:stopId',
  stopModel.getSpecificStopValidation,
  stopModel.getSpecificStop,
  function (req, res, next) {
    res.json(res.results);
  }
);

router.post('/',
  stopModel.getStopsNextByValidation,
  stopModel.getStopsNextBy,
  function (req, res, next) {
    res.json(res.results);
  }
);
module.exports = router;