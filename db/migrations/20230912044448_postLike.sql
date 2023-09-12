-- migrate:up
CREATE TABLE postLike (
  `postLike_id` INT NOT NULL AUTO_INCREMENT,
  `id` INT NOT NULL,
  `post_id` INT NOT NULL,
  PRIMARY KEY (`postLike_id`));

-- migrate:down

