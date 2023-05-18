CREATE TABLE "follower" (
  "follower_id" int NOT NULL AUTO_INCREMENT,
  "who_id" int DEFAULT NULL,
  "whom_id" int DEFAULT NULL,
  PRIMARY KEY ("follower_id"),
  KEY "whom_id" ("whom_id"),
  KEY "idx_combined_follower" ("who_id","whom_id"),
  CONSTRAINT "follower_ibfk_1" FOREIGN KEY ("who_id") REFERENCES "user" ("user_id"),
  CONSTRAINT "follower_ibfk_2" FOREIGN KEY ("whom_id") REFERENCES "user" ("user_id")
)

CREATE TABLE "latest" (
  "latest_id" bigint NOT NULL,
  PRIMARY KEY ("latest_id")
)

CREATE TABLE "message" (
  "message_id" int NOT NULL AUTO_INCREMENT,
  "author_id" int NOT NULL,
  "text" varchar(255) NOT NULL,
  "pub_date" bigint DEFAULT NULL,
  "flagged" int DEFAULT NULL,
  PRIMARY KEY ("message_id"),
  KEY "author_id" ("author_id"),
  KEY "idx_combined_message" ("flagged","pub_date","author_id"),
  CONSTRAINT "message_ibfk_1" FOREIGN KEY ("author_id") REFERENCES "user" ("user_id")
)

CREATE TABLE "sessions" (
  "session_id" varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  "expires" int unsigned NOT NULL,
  "data" mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY ("session_id")
)

CREATE TABLE "user" (
  "user_id" int NOT NULL AUTO_INCREMENT,
  "username" varchar(255) NOT NULL,
  "email" varchar(255) NOT NULL,
  "pw_hash" varchar(255) NOT NULL,
  PRIMARY KEY ("user_id"),
  KEY "idx_combined_user" ("user_id")
)