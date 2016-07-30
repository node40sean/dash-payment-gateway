CREATE DATABASE dashpay DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;

use dashpay;

CREATE TABLE
    user
    (
        username VARCHAR(255) NOT NULL,
        created_date DATETIME NOT NULL,
        PRIMARY KEY (username)
    )
    ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
CREATE TABLE
    receiver
    (
        receiver_id VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        dash_payment_address VARCHAR(255) NOT NULL,
        amount_fiat DECIMAL(19,2),
        type_fiat VARCHAR(20),
        base_fiat DECIMAL(19,2) NOT NULL,
        amount_duffs bigint NOT NULL,
        payment_received_amount_duffs bigint,
        created_date DATETIME NOT NULL,
        payment_date DATETIME,
        description VARCHAR(255),
        PRIMARY KEY (receiver_id),
        CONSTRAINT FK_userid FOREIGN KEY (username) REFERENCES user (username)
    )
    ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE
    data_cache
    (
        cache_key VARCHAR(255) NOT NULL,
        cache_data JSON,
        PRIMARY KEY (cache_key)
    )
    ENGINE=InnoDB DEFAULT CHARSET=utf8;
