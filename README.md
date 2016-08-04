# Dash Payment Gateway
***Please Note:*** *Documentation is a work in progress but actively maintained while the project is undergoing development.*

This is a Dash payment processor that can be run within your infrastructure to enable Dash payments as part of your customers' checkout experience. It is not customer facing, but rather a REST API that can be called by your backend server to handle Dash payments similar to how PayPal works. The entire process is made up up three independent components.

### The payment gateway (This application)
The payment gateway is a Node.js application that runs as a standalone web server and is the point of entry from your application. The primary responsibilities of the gateway are to record payment requests, calculate current Dash valuations from various fiat currencies,  manage payment address, and to notify your application when a payment has been made.

### Dash Insight API (External Dependency)
The Dash Insight API is a wrapper to a custom Dash build. It is used to query the block chain, primarily to look for payments.

### Dash Daemon - Custom Build  (External Dependency)
The dash daemon is the block chain and queried by the gateway via the Dash Insight API.

## Download / Install / Run
To download and install this payment gateway:

    git clone git@github.com:node40sean/dash-payment-gateway.git
    cd dash-payment-gateway/
    npm install

After you have configured a database (see below), you can run the server by issuing the command:

    npm start

## Testing
Test using Mocha

    npm install -g mocha

    npm test

## Database
The gateway stores persistent data in a MySQL database. The [schema](https://github.com/node40sean/dash-payment-gateway/blob/master/resources/mysql-schema.sql) is located in the `resources/` folder.

### Configuration

You'll need to create a database configuration file from a template. From the root of the project run:

    cd config/ ; cp DBConfig-template.js DBConfig.js ; cd -

Then, open `DBConfig.js` and supply your database credentials.

## Configuration
Application-level configuration, such as logging and external API endpoints is all maintained in `config/AppConfig.js`

### Insight
This application interacts with Insight via a URL. Ideally, you also control the Insight application in your own infrastructure. However, since you only need to supply this application an Insight URL, you are free to use a third party Insight provider. In fact, that is how it was developed. As of this writing, the Insight URL used is `http://jaxx-test.dash.org:3001/`

### Wallet Seed
You are respnsible for seeding the application with your Master Address Seed. This can be in BIP32 format, or Electrum format. Place the seed value in [AppConfig.js](https://github.com/node40sean/dash-payment-gateway/blob/master/config/AppConfig.js).

# Technical Docs

Developer documentation and endpoint specifications for clients can be found in the [wiki](https://github.com/node40sean/dash-payment-gateway/wiki).