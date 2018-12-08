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
- GET /v1/stop -> get list of stops.
- POST /v1/stop { nextTo:{ "type":"Point", "coordinates":[34.917812,32.183939]}} -> get list of stops nearby the given coordinates.
