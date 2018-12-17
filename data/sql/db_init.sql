--
-- PostgreSQL database dump
--

-- Dumped from database version 10.6 (Debian 10.6-1.pgdg90+1)
-- Dumped by pg_dump version 10.4

-- Started on 2018-12-01 15:07:54 UTC

--connect gtfs_db

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: mirror; Type: SCHEMA; Schema: -; Owner: postgres
--

--DROP TABLE IF EXISTS public.stops;
DROP TABLE IF EXISTS mirror.agency;
DROP TABLE IF EXISTS mirror.calendar;
DROP TABLE IF EXISTS mirror.fare_attributes;
DROP TABLE IF EXISTS mirror.fare_rules;
DROP TABLE IF EXISTS mirror.routes;
DROP TABLE IF EXISTS mirror.shapes;
DROP TABLE IF EXISTS mirror.stop_times;
DROP TABLE IF EXISTS mirror.stops;
DROP TABLE IF EXISTS mirror.trips;
DROP SCHEMA IF EXISTS mirror;


CREATE SCHEMA mirror;
ALTER SCHEMA mirror OWNER TO postgres;
SET default_tablespace = '';
SET default_with_oids = false;

--
-- Name: agency; Type: TABLE; Schema: mirror; Owner: postgres
--
CREATE TABLE mirror.agency (
    agency_id integer NOT NULL,
    agency_name character varying(50),
    agency_url character varying(200),
    agency_timezone character varying(50),
    agency_lang character varying(10),
    agency_phone character varying(20),
    agency_fare_url character varying(200)
);


ALTER TABLE mirror.agency OWNER TO postgres;

--
-- Name: calendar; Type: TABLE; Schema: mirror; Owner: postgres
--
CREATE TABLE mirror.calendar (
    service_id integer NOT NULL,
    sunday boolean,
    monday boolean,
    tuesday boolean,
    wednesday boolean,
    thursday boolean,
    friday boolean,
    saturday boolean,
    start_date integer,
    end_date integer
);


ALTER TABLE mirror.calendar OWNER TO postgres;

--
-- Name: fare_attributes; Type: TABLE; Schema: mirror; Owner: postgres
--

CREATE TABLE mirror.fare_attributes (
    fare_id smallint NOT NULL,
    price double precision,
    currency_type character(5),
    payment_method smallint,
    transfers smallint,
    agency_id smallint,
    transfer_duration smallint
);


ALTER TABLE mirror.fare_attributes OWNER TO postgres;

--
-- Name: fare_rules; Type: TABLE; Schema: mirror; Owner: postgres
--

CREATE TABLE mirror.fare_rules (
    fare_id integer NOT NULL,
    route_id integer,
    origin_id integer,
    destination_id integer,
    contains_id integer
);


ALTER TABLE mirror.fare_rules OWNER TO postgres;

--
-- Name: routes; Type: TABLE; Schema: mirror; Owner: postgres
--

CREATE TABLE mirror.routes (
    route_id integer NOT NULL,
    agency_id smallint,
    route_short_name character varying(100),
    route_long_name character varying(200),
    route_desc character varying(100),
    route_type smallint,
    route_color character varying(10)
);


ALTER TABLE mirror.routes OWNER TO postgres;

--
-- Name: shapes; Type: TABLE; Schema: mirror; Owner: postgres
--

CREATE TABLE mirror.shapes (
    shape_id integer NOT NULL,
    shape_pt_lat double precision,
    shape_pt_lon double precision,
    shape_pt_sequence smallint
);


ALTER TABLE mirror.shapes OWNER TO postgres;

--
-- Name: stop_times; Type: TABLE; Schema: mirror; Owner: postgres
--

CREATE TABLE mirror.stop_times (
    trip_id character varying(20),
    arrival_time character varying(8),
    departure_time character varying(8),
    stop_id integer,
    stop_sequence smallint,
    pickup_type smallint,
    drop_off_type smallint,
    shape_dist_traveled integer
);


ALTER TABLE mirror.stop_times OWNER TO postgres;

--
-- Name: stops; Type: TABLE; Schema: mirror; Owner: postgres
--

CREATE TABLE mirror.stops (
    stop_id integer,
    stop_code integer,
    stop_name character varying(200),
    stop_desc character varying(200),
    stop_lat double precision,
    stop_lon double precision,
    location_type integer,
    parent_station integer,
    zone_id integer
);


ALTER TABLE mirror.stops OWNER TO postgres;

--
-- Name: trips; Type: TABLE; Schema: mirror; Owner: postgres
--

CREATE TABLE mirror.trips (
    route_id integer,
    service_id integer,
    trip_id character varying(20),
    trip_headsign character varying(100),
    direction_id smallint,
    shape_id integer
);


ALTER TABLE mirror.trips OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

--CREATE TABLE public.stops (
--    stop_id integer,
--    stop_code integer,
--    stop_name text,
--    stop_desc text,
--    stop_lat double precision,
--    stop_lon double precision,
--    location_type integer,
--    parent_station integer,
--    zone_id integer,
--   location public.geography(Point,4326)
--);


--ALTER TABLE public.stops OWNER TO postgres;

CREATE OR REPLACE VIEW mirror.routes_in_stop AS
SELECT max(arrival_time::interval) max_arrival_time,min(arrival_time::interval) min_arrival_time ,stop_id,t.route_id
	FROM mirror.stop_times st
	join mirror.trips t
	on st.trip_id = t.trip_id
	group by stop_id,t.route_id;

ALTER TABLE mirror.routes_in_stop
    OWNER TO postgres;


CREATE OR REPLACE VIEW mirror.routes_name_in_stop AS
 SELECT DISTINCT r.route_short_name,
    a.agency_name,
    rs.stop_id
   FROM mirror.routes_in_stop rs
     JOIN mirror.routes r ON rs.route_id = r.route_id
     JOIN mirror.agency a ON r.agency_id = a.agency_id;

ALTER TABLE mirror.routes_name_in_stop
    OWNER TO postgres;