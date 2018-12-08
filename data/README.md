# rest-gtfs
REST-API for GTFS

Examples:

You could use the following command for use pgadmin:

````docker run -p 80:80 -e "PGADMIN_DEFAULT_EMAIL=user@domain.com" -e "PGADMIN_DEFAULT_PASSWORD=SuperSecret" -d dpage/pgadmin4````
    
Let say that we stand in Aliezer Kaplan & Menachem Begin in Tel-Aviv. The location could be declare as:

```
select ST_SetSRID(ST_MakePoint(34.790128, 32.073608),4326) AS "Aliezer Kaplan & Menachem Begin"
```

Here is the query for the 10 nearest stops from that point:

```
SELECT stop_id, stop_code, stop_name, stop_desc, stop_lat, stop_lon, location_type, parent_station, zone_id
	FROM mirror.stops
	ORDER BY ST_SetSRID(ST_MakePoint(stop_lon,stop_lat),4326) <->  ST_SetSRID(ST_MakePoint(34.790128, 32.073608),4326)
	LIMIT 10
  ```
