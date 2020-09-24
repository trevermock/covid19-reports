create database dds;

-- Org ID Sequence
CREATE SEQUENCE IF NOT EXISTS public.org_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

-- Org Table
CREATE TABLE IF NOT EXISTS public.org
(
    id integer NOT NULL DEFAULT nextval('org_id_seq'::regclass),
    name character varying(200) NOT NULL,
    description character varying(2048) NOT NULL,
    index_prefix character varying NOT NULL DEFAULT ''::character varying,
    CONSTRAINT "org_pkey" PRIMARY KEY (id)
);

-- Role ID Sequence
CREATE SEQUENCE IF NOT EXISTS public.role_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

-- Role Table
CREATE TABLE IF NOT EXISTS public.role
(
    id integer NOT NULL DEFAULT nextval('role_id_seq'::regclass),
    name character varying(2048) NOT NULL,
    description character varying(2048) NOT NULL,
    index_prefix character varying NOT NULL DEFAULT ''::character varying,
    can_manage_users boolean NOT NULL DEFAULT false,
    can_manage_roster boolean NOT NULL DEFAULT false,
    can_manage_roles boolean NOT NULL DEFAULT false,
    can_view_roster boolean NOT NULL DEFAULT false,
    can_view_muster boolean NOT NULL DEFAULT false,
    can_manage_dashboards boolean NOT NULL DEFAULT false,
    notify_on_access_request boolean NOT NULL DEFAULT false,
    org_id integer NOT NULL,
    CONSTRAINT "role_pkey" PRIMARY KEY (id),
    CONSTRAINT "org_fkey" FOREIGN KEY (org_id)
        REFERENCES public.org (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

-- Roster Table
CREATE TABLE IF NOT EXISTS public.roster
(
    edipi character varying(10) NOT NULL,
    rate_rank character varying(100),
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    unit character varying(50) NOT NULL,
    billet_workcenter character varying(50) NOT NULL,
    contract_number character varying(100) NOT NULL,
    pilot boolean NOT NULL DEFAULT false,
    aircrew boolean NOT NULL DEFAULT false,
    cdi boolean NOT NULL DEFAULT false,
    cdqar boolean NOT NULL DEFAULT false,
    dscacrew boolean NOT NULL DEFAULT false,
    advanced_party boolean NOT NULL DEFAULT false,
    pui boolean NOT NULL DEFAULT false,
    covid19_test_return_date timestamp without time zone,
    rom character varying(50),
    rom_release character varying(100),
    org_id integer NOT NULL,
    CONSTRAINT "roster_pkey" PRIMARY KEY (edipi, org_id),
    CONSTRAINT "org_fkey" FOREIGN KEY (org_id)
        REFERENCES public.org (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

-- User Table
CREATE TABLE IF NOT EXISTS public."user"
(
    edipi character varying(10) NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    phone character varying NOT NULL,
    email character varying NOT NULL,
    enabled boolean NOT NULL DEFAULT true,
    root_admin boolean NOT NULL DEFAULT false,
    is_registered boolean NOT NULL DEFAULT false,
    CONSTRAINT "user_pkey" PRIMARY KEY (edipi)
);

-- User Roles Table
CREATE TABLE IF NOT EXISTS public.user_roles
(
    "user" character varying(10) NOT NULL,
    role integer NOT NULL,
    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user", role),
    CONSTRAINT "role_fkey" FOREIGN KEY (role)
        REFERENCES public.role (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "user_fkey" FOREIGN KEY ("user")
        REFERENCES public."user" (edipi) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

-- Access Request ID Sequence
CREATE SEQUENCE IF NOT EXISTS public.access_request_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

-- Access Request Table
CREATE TABLE IF NOT EXISTS public.access_request
(
    id integer NOT NULL DEFAULT nextval('access_request_id_seq'::regclass),
    request_date timestamp without time zone NOT NULL DEFAULT now(),
    user_edipi character varying(10) NOT NULL,
    org_id integer NOT NULL,
    CONSTRAINT "access_request_pkey" PRIMARY KEY (id),
    CONSTRAINT "user_fkey" FOREIGN KEY (user_edipi)
        REFERENCES public."user" (edipi) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "org_fkey" FOREIGN KEY (org_id)
        REFERENCES public.org (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);
