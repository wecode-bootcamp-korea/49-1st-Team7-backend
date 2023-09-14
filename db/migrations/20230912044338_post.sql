-- migrate:up
CREATE TABLE post (
`postId` INT NOT NULL AUTO_INCREMENT,
`nickname` VARCHAR(50) NOT NULL,
`content` VARCHAR(3000) NOT NULL,
`profileImage` VARCHAR(1000) NULL,
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`postId`));

-- migrate:down

