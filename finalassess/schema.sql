CREATE DATABASE second_hand;

USE second_hand;

CREATE TABLE postings (
    posting_id VARCHAR(8) NOT NULL PRIMARY KEY,
    posting_date DATE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(128) NOT NULL,
    phone VARCHAR(255) DEFAULT '',
    title VARCHAR(256) NOT NULL,
    description TEXT,
    image VARCHAR(256) NOT NULL
);
