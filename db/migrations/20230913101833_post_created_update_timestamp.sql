-- migrate:up
ALTER TABLE post MODIFY COLUMN 'created_At' TIMESTAMP NOT NULL DEFAULT 'CURRENT_TIMESTAMP';
-- ALTER TABLE post MODIFY COLUMN 'update_At' TIMESTAMP NULL DEFAULT 'CURRENT_TIMESTAMP';

-- migrate:down