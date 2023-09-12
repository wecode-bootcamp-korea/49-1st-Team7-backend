-- migrate:up
CREATE TABLE commentLike (
  `commentLike_id` INT NOT NULL AUTO_INCREMENT,
  `content_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`commentLike_id`));

-- migrate:down

