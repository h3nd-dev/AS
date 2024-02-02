# Overview

**AUGMENT EXPERIENCES WITH A SAFER, SIMPLER AND MORE PRIVATE WAY TO LOGIN**

A paradigm shift in the registration and sign-in process, Affinidi Login is a game-changing solution for developers. With our revolutionary passwordless authentication solution your user's first sign-in doubles as their registration, and all the necessary data for onboarding can be requested during this streamlined sign-in/signup process. End users are in full control, ensuring that they consent to the information shared in a transparent and user-friendly manner. This streamlined approach empowers developers to create efficient user experiences with data integrity, enhanced security and privacy, and ensures compatibility with industry standards.

| Passwordless Authentication | Decentralised Identity Management | Uses Latest Standards |
|---|---|---|
| Offers a secure and user-friendly alternative to traditional password-based authentication by eliminating passwords and thus removing the vulnerability to password-related attacks such as phishing and credential stuffing. | Leverages OID4VP to enable users to control their data and digital identity, selectively share their credentials and authenticate themselves across multiple platforms and devices without relying on a centralised identity provider. | Utilises OID4VP to enhance security of the authentication process by verifying user authenticity without the need for direct communication with the provider, reducing risk of tampering and ensuring data integrity. |

# @affinidi/passport-affinidi

@affinidi/passport-affinidi is a powerful module for authenticating users with `Affinidi Login` using the OIDC Code Grant flow. This strategy seamlessly integrates `Affinidi Login` into your Node.js applications. By leveraging Passport, you can effortlessly incorporate Affinidi authentication into any application or framework that supports Connect-style middleware, including Express.

This provider simplifies the process by creating an Affinidi OpenID client and registering two essential routes:

1. **Initialization Route**: The first GET route (defaulted to `/api/affinidi-auth/init`) returns the Affinidi authorization URL, which allows frontend applications to redirect to Affinidi Login flow.
2. **Completion Route**: The second POST route (defaulted to `/api/affinidi-auth/complete`) processes the response (code and state) from Affinidi authorization server, performs the exchange for the ID Token, and returns the user's profile.

## Installation

```
npm install @affinidi/passport-affinidi
```

## Usage
Here's how to use `@affinidi/passport-affinidi` in your Node.js application:

1. Import the affinidi provider

```
import { affinidiProvider } from '@affinidi/passport-affinidi'
```

2. Initialize the provider by passing your express server instance and configuration options, including the Affinidi's issuer, client ID, secret, and redirect URIs.

```
 await affinidiProvider(app, {
        id: "affinidi",
        issuer: process.env.AFFINIDI_ISSUER,
        client_id: process.env.AFFINIDI_CLIENT_ID,
        client_secret: process.env.AFFINIDI_CLIENT_SECRET,
        redirect_uris: ['http://localhost:3000/auth/callback']
    });
```

## Example: Express Server with @affinidi/passport-affinidi

```
var express = require('express');
require('dotenv').config()

import { affinidiProvider } from '@affinidi/passport-affinidi'

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3001;

const initializeServer = async () => {

    app.get('/', function (req, res, next) {
        res.json({ success: 'Express' });
    });

    await affinidiProvider(app, {
        id: "affinidi",
        issuer: process.env.AFFINIDI_ISSUER,
        client_id: process.env.AFFINIDI_CLIENT_ID,
        client_secret: process.env.AFFINIDI_CLIENT_SECRET,
        redirect_uris: ['http://localhost:3000/auth/callback'],
        expressSesssion: {
            session_secret: "express session secret key",
        },
        routes: {
            init: '/api/affinidi-auth/init',
            complete: '/api/affinidi-auth/complete'
        },
        verifyCallback: (tokenSet, userinfo, done) => {
            console.log('verify callback', tokenSet, userinfo);
            return done(null, tokenSet.claims());
        },
        onSuccess: (user, profile) => {
            console.log('success', profile);
        },
        onError: (err) => {
            console.log('error', err);
        },
    });

    app.listen(PORT, () => {
        console.log(`Server listening on ${PORT}`);
    });

}

initializeServer();

```

## Create a React Frontend App
To build a frontend that interacts with this server, you can follow the instructions provided in the [@affinidi/affinidi-react-auth](https://www.npmjs.com/package/@affinidi/affinidi-react-auth) package.

## Sample API Calls from a Frontend
Here's how to initiate and complete the Affinidi Code Grant flow from your frontend:

1. Initiate the Affinidi flow

```
const res = await fetch(`/api/affinidi-auth/init`, {
  method: "get",
  headers: {
    "Content-Type": "application/json",
  },
});

const data = await res.json();
window.location.href = data.authorizationUrl;
```

2. Complete the Affinidi flow from callback url and get user profile/error

```
const code = "ory_ac_cpJavrZRCrcF1OgbOhSCTlaTwjEWCEArHKrUsLDKGnU.Nsfxhk7IGJ9ePGEMtCS3-Vy78-KGpX4QPRWWL8CBiDg" // get from querystring name "code"
const state = "YvK_vGNLUYXF96wnd-wHfzZ2klAPu0Y_X5zoHfsXRk4" // get from querystring name "state"
const res = await fetch(`/api/affinidi-auth/complete`, {
  method: "post",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ code, state }),
});

const response = await res.json();
if (response.error) {
  console.log('error', `${response.error}-${response.error_description}`)
} else {
  console.log('success', response.user)
}
```
