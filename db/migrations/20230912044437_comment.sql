-- migrate:up
CREATE TABLE comment (
  `commentId` INT NOT NULL AUTO_INCREMENT,
  `nickname` VARCHAR(50) NOT NULL,
  `comment` VARCHAR(1000) NOT NULL,
  `isMyReply` TINYINT NOT NULL,
  `created_At` VARCHAR(45) NOT NULL DEFAULT 'CURRENT_TIMESTAMP',
  PRIMARY KEY (`commentId`));

-- migrate:down

