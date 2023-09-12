-- migrate:up
CREATE TABLE user (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nickname` VARCHAR(50) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  `password` VARCHAR(200) NOT NULL,
  `profileImage` VARCHAR(1000) NULL,
  `birthday` DATE NULL,
  `created_at` VARCHAR(45) NOT NULL DEFAULT 'DEFAULT CURRENT_TIMESTAMP',
  `updated_at` VARCHAR(45) NULL DEFAULT 'ON UPDATED CURRENT_TIMESTAMP',
  `phoneNumber` INT NOT NULL,
  PRIMARY KEY (`id`));

-- migrate:down

