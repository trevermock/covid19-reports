--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: access_request_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.access_request_status_enum AS ENUM (
    'pending',
    'denied'
);


ALTER TYPE public.access_request_status_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: access_request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.access_request (
    id integer NOT NULL,
    request_date timestamp without time zone DEFAULT now() NOT NULL,
    status public.access_request_status_enum DEFAULT 'pending'::public.access_request_status_enum NOT NULL,
    user_edipi character varying(10),
    org_id integer
);


ALTER TABLE public.access_request OWNER TO postgres;

--
-- Name: access_request_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.access_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.access_request_id_seq OWNER TO postgres;

--
-- Name: access_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.access_request_id_seq OWNED BY public.access_request.id;


--
-- Name: org; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.org (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    description character varying(2048) NOT NULL,
    index_prefix character varying DEFAULT ''::character varying NOT NULL,
    contact_id character varying(10)
);


ALTER TABLE public.org OWNER TO postgres;

--
-- Name: org_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.org_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.org_id_seq OWNER TO postgres;

--
-- Name: org_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.org_id_seq OWNED BY public.org.id;


--
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    id integer NOT NULL,
    name character varying(2048) NOT NULL,
    description character varying(2048) NOT NULL,
    index_prefix character varying DEFAULT ''::character varying NOT NULL,
    notify_on_access_request boolean DEFAULT false NOT NULL,
    can_manage_users boolean DEFAULT false NOT NULL,
    can_manage_roster boolean DEFAULT false NOT NULL,
    can_manage_roles boolean DEFAULT false NOT NULL,
    can_view_roster boolean DEFAULT false NOT NULL,
    can_view_muster boolean DEFAULT false NOT NULL,
    can_manage_dashboards boolean DEFAULT false NOT NULL,
    org_id integer
);


ALTER TABLE public.role OWNER TO postgres;

--
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.role_id_seq OWNER TO postgres;

--
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;


--
-- Name: roster; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roster (
    edipi character varying(10) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    unit character varying(50) NOT NULL,
    billet_workcenter character varying(50) NOT NULL,
    contract_number character varying(100) NOT NULL,
    rate_rank character varying(100),
    pilot boolean DEFAULT false NOT NULL,
    aircrew boolean DEFAULT false NOT NULL,
    cdi boolean DEFAULT false NOT NULL,
    cdqar boolean DEFAULT false NOT NULL,
    dscacrew boolean DEFAULT false NOT NULL,
    advanced_party boolean DEFAULT false NOT NULL,
    pui boolean DEFAULT false NOT NULL,
    covid19_test_return_date timestamp without time zone,
    rom character varying(50),
    rom_release character varying(100),
    last_reported timestamp without time zone,
    org_id integer NOT NULL
);


ALTER TABLE public.roster OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    edipi character varying(10) NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    phone character varying NOT NULL,
    email character varying NOT NULL,
    service character varying NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    root_admin boolean DEFAULT false NOT NULL,
    is_registered boolean DEFAULT false NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    "user" character varying(10) NOT NULL,
    role integer NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: access_request id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_request ALTER COLUMN id SET DEFAULT nextval('public.access_request_id_seq'::regclass);


--
-- Name: org id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.org ALTER COLUMN id SET DEFAULT nextval('public.org_id_seq'::regclass);


--
-- Name: role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);


--
-- Data for Name: access_request; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.access_request (id, request_date, status, user_edipi, org_id) FROM stdin;
\.


--
-- Data for Name: org; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.org (id, name, description, index_prefix, contact_id) FROM stdin;
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role (id, name, description, index_prefix, notify_on_access_request, can_manage_users, can_manage_roster, can_manage_roles, can_view_roster, can_view_muster, can_manage_dashboards, org_id) FROM stdin;
\.


--
-- Data for Name: roster; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roster (edipi, first_name, last_name, unit, billet_workcenter, contract_number, rate_rank, pilot, aircrew, cdi, cdqar, dscacrew, advanced_party, pui, covid19_test_return_date, rom, rom_release, last_reported, org_id) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (edipi, first_name, last_name, phone, email, service, enabled, root_admin, is_registered) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles ("user", role) FROM stdin;
\.


--
-- Name: access_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.access_request_id_seq', 1, false);


--
-- Name: org_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.org_id_seq', 1, false);


--
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_id_seq', 1, false);


--
-- Name: roster PK_6d3bc54502350051de7e30cfb91; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roster
    ADD CONSTRAINT "PK_6d3bc54502350051de7e30cfb91" PRIMARY KEY (edipi, org_id);


--
-- Name: org PK_703783130f152a752cadf7aa751; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.org
    ADD CONSTRAINT "PK_703783130f152a752cadf7aa751" PRIMARY KEY (id);


--
-- Name: user_roles PK_949caf046fc278bd72bd4cbef84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "PK_949caf046fc278bd72bd4cbef84" PRIMARY KEY ("user", role);


--
-- Name: access_request PK_a543250cab0b6d2eb3a85593d93; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_request
    ADD CONSTRAINT "PK_a543250cab0b6d2eb3a85593d93" PRIMARY KEY (id);


--
-- Name: role PK_b36bcfe02fc8de3c57a8b2391c2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY (id);


--
-- Name: user PK_f2d7df953fa9efab0ce105ee24d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_f2d7df953fa9efab0ce105ee24d" PRIMARY KEY (edipi);


--
-- Name: IDX_0475850442d60bd704c5804155; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_0475850442d60bd704c5804155" ON public.user_roles USING btree (role);


--
-- Name: IDX_781a1c15149789c1609fe1b025; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_781a1c15149789c1609fe1b025" ON public.user_roles USING btree ("user");


--
-- Name: user_roles FK_0475850442d60bd704c58041551; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "FK_0475850442d60bd704c58041551" FOREIGN KEY (role) REFERENCES public.role(id) ON DELETE CASCADE;


--
-- Name: org FK_0630c49a2a4170cc7c1513ba38b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.org
    ADD CONSTRAINT "FK_0630c49a2a4170cc7c1513ba38b" FOREIGN KEY (contact_id) REFERENCES public."user"(edipi) ON DELETE RESTRICT;


--
-- Name: role FK_1e101d094ff40fa4ed179ac014c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "FK_1e101d094ff40fa4ed179ac014c" FOREIGN KEY (org_id) REFERENCES public.org(id);


--
-- Name: access_request FK_309a26a4130d531a5c0c80e915f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_request
    ADD CONSTRAINT "FK_309a26a4130d531a5c0c80e915f" FOREIGN KEY (user_edipi) REFERENCES public."user"(edipi);


--
-- Name: user_roles FK_781a1c15149789c1609fe1b0258; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "FK_781a1c15149789c1609fe1b0258" FOREIGN KEY ("user") REFERENCES public."user"(edipi) ON DELETE CASCADE;


--
-- Name: roster FK_933f7dbcd30d5bc6eb9e2048510; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roster
    ADD CONSTRAINT "FK_933f7dbcd30d5bc6eb9e2048510" FOREIGN KEY (org_id) REFERENCES public.org(id);


--
-- Name: access_request FK_f7b4d940ab0c531be455c5f9179; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_request
    ADD CONSTRAINT "FK_f7b4d940ab0c531be455c5f9179" FOREIGN KEY (org_id) REFERENCES public.org(id);


--
-- PostgreSQL database dump complete
--

