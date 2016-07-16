# Airbitz Javascript core

Run `npm install` to get the dependencies you need,
then run `npm test` to run the tests.

To build for the web, run `npm run webpack`

Until Airbitz makes the auth server available without special certificates,
running the live unit tests requires:

    export NODE_TLS_REJECT_UNAUTHORIZED=0

To avoid these issues, and to keep things independent of the network,
the live unit tests are disabled for now.

All sources are in the [JavaScript Standard Style](http://standardjs.com/).


# Airbitz Javascript UI

To build the UI library`npm run ui-webpack`. You can view the samples by running
`npm run samples` and navigating to http://localhost:3000/basic/.
