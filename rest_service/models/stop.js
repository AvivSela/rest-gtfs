const {
    Pool
} = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'gtfs_db',
    password: '123',
    port: 5432,
})


function getStops(req, res, next) {
    pool.query(`SELECT stop_id, stop_code, stop_name, stop_desc, stop_lat,
                       stop_lon, location_type, parent_station, zone_id,
                       ST_AsGeoJSON(ST_SetSRID(ST_MakePoint(stop_lon,stop_lat),4326))
                       AS geojson
                FROM mirror.stops
                LIMIT 1000`)
        .then(query_result => {
            res.results = query_result.rows.map(x => new Stop(x))
            next()
        })
        .catch(e => next(e))
};


function getSpecificStopValidation(req, res, next){
    req.params.stopId = parseInt(req.params.stopId, 10)
    if (req.params.stopId){
      next()
    } else {
      next({'code':404,'message':'parameter should be a number'})
    }
  }

function getSpecificStop(req, res, next) {
    pool.query(`SELECT stop_id, stop_code, stop_name, stop_desc, stop_lat,
                    stop_lon, location_type, parent_station, zone_id,
                    ST_AsGeoJSON(ST_SetSRID(ST_MakePoint(stop_lon,stop_lat),4326))
                    AS geojson
                FROM mirror.stops
                WHERE stop_id = $1`, [req.params.stopId])
        .then(query_result => {
            res.results = new Stop(query_result.rows[0])

            next()
        })
        .catch(e => next(e))
}

function getStopsNextByValidation(req, res, next) {
    if (req.body.nextTo && req.body.nextTo.coordinates && req.body.nextTo.coordinates.length == 2) {
      req.body.limit = (req.body.limit ? req.body.limit : 3)
      next()
    } else {
      next({
        'code': 520,
        'message': 'syntax error ' + req.body
      })
    }
  }


function getStopsNextBy(req, res, next) {
    pool.query(`SELECT  stop_id, stop_code, stop_name, stop_desc, stop_lat,
                        stop_lon, location_type, parent_station, zone_id,
                        ST_AsGeoJSON(ST_SetSRID(ST_MakePoint(stop_lon,stop_lat),4326))
                        AS geojson
                FROM mirror.stops
                ORDER BY ST_SetSRID(ST_MakePoint(stop_lon,stop_lat),4326)
                         <->  ST_SetSRID(ST_MakePoint($1, $2),4326)
	            LIMIT $3`, [req.body.nextTo.coordinates[0], req.body.nextTo.coordinates[1], req.body.limit])
        .then(query_result => {
            res.results = query_result.rows.map(x => new Stop(x))
            next()
        })
        .catch(e => next(e))
}


class Stop {
    constructor(row) {
        this.id = row.stop_id;
        this.code = row.stop_code
        this.name = row.stop_name
        this.desc = row.stop_desc
        this.zone_id = row.zone_id
        this.position = JSON.parse(row.geojson);
    }
}

module.exports.getStops = getStops;
module.exports.getSpecificStop = getSpecificStop;
module.exports.getStopsNextBy = getStopsNextBy;



module.exports = {
    'pool':pool,
    'getStops': getStops,
    'getSpecificStop': getSpecificStop,
    'getStopsNextBy': getStopsNextBy,
    'getSpecificStopValidation': getSpecificStopValidation,
    'getStopsNextByValidation': getStopsNextByValidation,

}