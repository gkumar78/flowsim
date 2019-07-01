
-- create an enumerated type for the account status
CREATE TYPE SUBSCRIBERS_STATUS AS ENUM (
  'CREATED',  -- registered but not verified, logins should not be possible
  'ACTIVE',   -- verified and can actively login
  'RESET',    -- password reset, no logins possible only pwd reset procedure
  'CLOSED'    -- closed, no functionality is supported against this state
);

-- create the primary subscriber table
CREATE TABLE subscriber
(
  id SERIAL PRIMARY KEY,                       -- internal id uses for sub
  email VARCHAR(128) NOT NULL UNIQUE,          -- email owned by sub
  password VARCHAR(60) NOT NULL,               -- hashed pwd of sub
  reg_date TIMESTAMP WITH TIME ZONE NOT NULL,  -- date/time of registration
  reg_ip INET NOT NULL,                        -- ip used for registration
  verification_token CHAR(36) NOT NULL UNIQUE, -- verification token
  status SUBSCRIBERS_STATUS NOT NULL           -- current sub disposition
);

-- create the mailinglist table
CREATE TABLE mailinglist
(
  email VARCHAR(128) NOT NULL UNIQUE,          -- email owned by sub
  date TIMESTAMP WITH TIME ZONE NOT NULL  -- date/time of registration
);

CREATE TYPE MAILER_STATUS AS ENUM (
  'SUBSCRIBED',
  'UNSUBSCRIBE'
);

CREATE TABLE flogmailer
(
  id SERIAL PRIMARY KEY , -- internal mailer id
  firstname varchar(30) NOT NULL, 
  lastname varchar(30) NOT NULL,
  company varchar(60),
  email varchar(128) NOT NULL,
  subscribe_token CHAR(36) NOT NULL UNIQUE,
  status MAILER_STATUS NOT NULL
);
  
-- create a session table
CREATE TABLE session
(
  id SERIAL PRIMARY KEY,                            -- internal sesison id
  subscriber_id INTEGER references subscriber(id) NOT NULL, -- reference to sub
  key CHAR(36) NOT NULL UNIQUE,                     -- session key for API
  timeout TIMESTAMP WITH TIME ZONE NOT NULL         -- date/time for session to end
  -- ip INET NOT NULL                               -- ip used for session
);

-- create the primary packet table
CREATE TABLE packet
(
  id SERIAL PRIMARY KEY,                         -- internal id uses for sub
  subscriber_id INTEGER references subscriber(id) NOT NULL, -- reference to sub
  name VARCHAR(60) NOT NULL,                                -- packet name
  packet JSON NOT NULL,                                     -- packet
  unique(subscriber_id, name)                             -- name unique to sub
);

-- create the primary profile table
CREATE TABLE profile
(
  id SERIAL PRIMARY KEY,                        -- internal id uses for sub
  subscriber_id INTEGER references subscriber(id) NOT NULL, -- ref to sub
  name VARCHAR(60) NOT NULL,                                -- profile name
  profile JSON NOT NULL,                                    -- profile
  unique(subscriber_id, name)                              -- name unique to sub
);

-- create the primary switch table
CREATE TABLE switch
(
  id SERIAL PRIMARY KEY,                        -- internal id uses for sub
  subscriber_id INTEGER references subscriber(id) NOT NULL, -- ref to sub
  name VARCHAR(60) NOT NULL,                                -- switch name
  _switch JSON NOT NULL,                                    -- switch
  unique(subscriber_id, name)                              -- name unique to sub
);

-- create the primary trace table
CREATE TABLE trace
(
  id SERIAL PRIMARY KEY,                        -- internal id uses for sub
  subscriber_id INTEGER references subscriber(id) NOT NULL, -- ref to sub
  name VARCHAR(60) NOT NULL,                                -- trace name
  trace JSON NOT NULL,                                    -- trace
  unique(subscriber_id, name)                              -- name unique to sub
);
