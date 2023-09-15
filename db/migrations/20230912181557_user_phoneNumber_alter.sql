-- migrate:up
ALTER TABLE user MODIFY COLUMN phoneNumber INT NULL;

-- migrate:down

