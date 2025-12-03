CREATE TABLE users
(
    user_id  BIGINT AUTO_INCREMENT NOT NULL,
    username VARCHAR(100)          NOT NULL,
    email    VARCHAR(100)          NOT NULL,
    password VARCHAR(255)          NOT NULL,
    `role`   VARCHAR(50)           NOT NULL,
    active   BIT(1)                NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (user_id)
);

ALTER TABLE users
    ADD CONSTRAINT uc_users_email UNIQUE (email);

ALTER TABLE users
    ADD CONSTRAINT uc_users_username UNIQUE (username);