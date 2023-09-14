-- migrate:up
ALTER TABLE post DROP COLUMN update_At;
ALTER TABLE comment DROP COLUMN created_At;


-- migrate:down

