-- migrate:up
ALTER TABLE user MODIFY COLUMN email varchar(200) NOT NULL UNIQUE;

-- migrate:down
