-- migrate:up
ALTER TABLE user ADD COLUMN created_at NOT NULL DEFAULT CURRENT_TIMESTAMP


-- migrate:down

