-- migrate:up
CREATE TABLE post (
  `postId` INT NOT NULL AUTO_INCREMENT,
  `nickname` VARCHAR(50) NOT NULL,
  `content` VARCHAR(3000) NOT NULL,
  `profileImage` VARCHAR(1000) NOT NULL,
  `created_At` VARCHAR(45) NOT NULL DEFAULT 'CURRENT_TIMESTAMP',
  `update_At` VARCHAR(45) NULL DEFAULT 'CURRENT_TIMESTAMP',
  `isMyPost` TINYINT NULL,
  `IsLiked` TINYINT NULL,
  `likeCount` INT NULL,
  PRIMARY KEY (`postId`));

-- migrate:down

