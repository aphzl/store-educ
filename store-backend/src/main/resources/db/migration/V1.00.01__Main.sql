CREATE TABLE resource (
    id CHARACTER VARYING NOT NULL,
    inventory_id CHARACTER VARYING,
    name CHARACTER VARYING NOT NULL,
    amount INTEGER NOT NULL DEFAULT 0,
    comment CHARACTER VARYING
);

    CREATE TABLE user_request (
        id CHARACTER VARYING NOT NULL,
        declarer CHARACTER VARYING NOT NULL,
        status CHARACTER VARYING NOT NULL,
        created_timestamp TIMESTAMP,
        updated_timestamp TIMESTAMP
    );

    CREATE TABLE request (
        id CHARACTER VARYING NOT NULL,
        user_request_id CHARACTER VARYING NOT NULL,
        resource_id CHARACTER VARYING NOT NULL,
        amount INTEGER NOT NULL DEFAULT 0
    );


ALTER TABLE resource
    ADD CONSTRAINT resource_pk PRIMARY KEY (id);

ALTER TABLE user_request
    ADD CONSTRAINT user_request_pk PRIMARY KEY (id);

ALTER TABLE request
    ADD CONSTRAINT request_pk PRIMARY KEY (id);

ALTER TABLE request
    ADD CONSTRAINT user_request_id_fkey FOREIGN KEY (user_request_id) REFERENCES user_request(id);

