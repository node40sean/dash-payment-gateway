CREATE DATABASE dashpay DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;

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
        type_fiat DECIMAL(19,2),
        base_fiat VARCHAR(20) NOT_NULL,
        amount_duffs bigint NOT NULL,
        payment_received_amount_duffs bigint,
        created_date DATETIME NOT NULL,
        payment_date DATETIME NOT NULL,
        PRIMARY KEY (receiver_id),
        CONSTRAINT FK_userid FOREIGN KEY (username) REFERENCES user (username)
    )
    ENGINE=InnoDB DEFAULT CHARSET=utf8;