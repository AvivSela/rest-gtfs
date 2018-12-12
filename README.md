# rest-gtfs
REST-API for GTFS
## Prerequisite
- docker
- npm
- python3

## How to use?

1. Start DB container: `python3 data/db_service.py start`
2. Upload current GTFS files in israel MOT: `python3 data/load_data.py`
3. Install rest-service dependencies: `npm --prefix ./rest_service install ./rest_service`
4. Test rest-service integration with the DB container: `npm test --prefix ./rest_service`
5. Start rest-service: `npm start --prefix ./rest_service`

- The main page avaliable in: `http://localhost:3000/`

## API:
- GET /v1/stop/1 -> get stop with id 1.
Return:

`{"id":3,"code":38833,"name":"הנחשול/הדייגים","desc":" רחוב:הנחשול 30 עיר: ראשון לציון רציף:   קומה:  ","zone_id":8300,"position":{"type":"Point","coordinates":[34.782828,31.984553]}}`
- GET /v1/stop -> get list of stops.
Return:

`[{"id":3,"code":38833,"name":"הנחשול/הדייגים","desc":" רחוב:הנחשול 30 עיר: ראשון לציון רציף:   קומה:  ","zone_id":8300,"position":{"type":"Point","coordinates":[34.782828,31.984553]}},{"id":9,"code":38839,"name":"הבנים/אלי כהן","desc":" רחוב:הבנים 4 עיר: קרית עקרון רציף:   קומה:  ","zone_id":469,"position":{"type":"Point","coordinates":[34.821857,31.862305]}}]`
- POST /v1/stop { nextTo:{ "type":"Point", "coordinates":[34.917812,32.183939]}} -> get list of stops nearby the given coordinates.
Return:

`[{"id":3,"code":38833,"name":"הנחשול/הדייגים","desc":" רחוב:הנחשול 30 עיר: ראשון לציון רציף:   קומה:  ","zone_id":8300,"position":{"type":"Point","coordinates":[34.782828,31.984553]}},{"id":9,"code":38839,"name":"הבנים/אלי כהן","desc":" רחוב:הבנים 4 עיר: קרית עקרון רציף:   קומה:  ","zone_id":469,"position":{"type":"Point","coordinates":[34.821857,31.862305]}}]`
