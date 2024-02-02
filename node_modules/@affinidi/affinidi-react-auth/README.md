# Overview

**AUGMENT EXPERIENCES WITH A SAFER, SIMPLER AND MORE PRIVATE WAY TO LOGIN**

A paradigm shift in the registration and sign-in process, Affinidi Login is a game-changing solution for developers. With our revolutionary passwordless authentication solution your user's first sign-in doubles as their registration, and all the necessary data for onboarding can be requested during this streamlined sign-in/signup process. End users are in full control, ensuring that they consent to the information shared in a transparent and user-friendly manner. This streamlined approach empowers developers to create efficient user experiences with data integrity, enhanced security and privacy, and ensures compatibility with industry standards.

| Passwordless Authentication | Decentralised Identity Management | Uses Latest Standards |
|---|---|---|
| Offers a secure and user-friendly alternative to traditional password-based authentication by eliminating passwords and thus removing the vulnerability to password-related attacks such as phishing and credential stuffing. | Leverages OID4VP to enable users to control their data and digital identity, selectively share their credentials and authenticate themselves across multiple platforms and devices without relying on a centralised identity provider. | Utilises OID4VP to enhance security of the authentication process by verifying user authenticity without the need for direct communication with the provider, reducing risk of tampering and ensuring data integrity. |


# Affinidi React Auth Plugin

Simplify the integration of `Affinidi Login` into your React Application with this plugin.

## Prerequisites

Before getting started, make sure you have the following prerequisites:

1. Install [Affinidi Vault](https://docs.affinidi.com/labs/affinidi-login-basic/#before-you-begin-i-classfa-solid-fa-stari) to discover, collect, store, share, and monetise your data with consent.

2. Install the [Affinidi CLI](https://docs.affinidi.com/dev-tools/affinidi-cli/) tool to interact with Affinidi services for managing projects, login configurations, user groups etc...

## Application Folder Structure
Let's start by creating a folder structure for your project. Here's an example of the directory structure:
```
- affinidi-apps
    - client-app
    - server-app
```
- *affinidi-apps*: The root folder for your project.
- *client-app*: A frontend React application.
- *server-app*: The backend API for your application.

## Create a React Application

1. Create a new React app named `client-app `using the following command:

```
npx create-react-app client-app
```

2. Change to the `client-app` directory and open the project in your preferred code editor:

```
cd client-app
```

3. Start the application to ensure it's working correctly:

```
npm start
```
Note: Your application will be available at http://localhost:3000/.

## Integrate Affinidi Login

Now, let's integrate `Affinidi Login` into your React application using the following steps:

1. Install the `@affinidi/affinidi-react-auth` npm package:

```
npm install @affinidi/affinidi-react-auth
```

2. To proxy unknown requests to your API server during development, add a `proxy` field to your `package.json` like this:

```
 "proxy": "http://localhost:3001",
```
You can find a sample `package.json` [here](https://github.com/affinidi/affinidi-react-auth/blob/main/playground/client-app/package.json).

3. In your `src/App.js` file, import the necessary components and hooks:

```
import React from "react";
import { AffinidiLoginButton, useAffinidiProfile } from '@affinidi/affinidi-react-auth'
```

4. Use the `useAffinidiProfile` hook to retrieve profile information once the login flow is completed:

```
const { isLoading, error, profile, handleLogout } = useAffinidiProfile()

async function logout() {
    //clear session cookie
    handleLogout();
    window.location.href = "/";
}
```

5. Add the following JSX code to display the Affinidi Login button, loading indicator, user profile, and error messages:

```
{!profile && <>
    <AffinidiLoginButton />
</>}

{isLoading && <p>Loading...</p>}

{profile && <>
    <button style={{ marginRight: 10 }} onClick={logout}>
    Logout
    </button>

    <h3>User Profile</h3>
    <pre style={{ textAlign: "left" }}>{JSON.stringify(profile, null, 4)}</pre>
</>}

{error && <><h2>error</h2>{error}</>}
```
You can find a sample `App.js` [here](https://github.com/affinidi/affinidi-react-auth/blob/main/playground/client-app/src/App.js).

6. Restart your application using `npm start`. This time, you should see the Affinidi Login button.

## Create an Express Server

Now, let's create a basic Express server for your backend API:

1. Create a folder named `server-app` and navigate to it:
```
mkdir server-app
cd server-app
```
2. Initialize the project by creating a `package.json` file:
```
npm init -y
```
You can find a sample package.json [here](https://github.com/affinidi/affinidi-react-auth/blob/main/playground/server-app/package.json).

3. Install the required packages: `express` for creating the server, `dotenv` for managing environment variables, and `nodemon` for automatic reloading:
```
npm install express dotenv nodemon
```
4. Create an `index.js` file and set up a basic Express server:
```
var express = require('express');
require('dotenv').config()

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3001;

const initializeServer = async () => {

    app.get('/', function (req, res, next) {
        res.json({ success: 'Express' });
    });

    app.listen(PORT, () => {
        console.log(`Server listening on ${PORT}`);
    });

}

initializeServer();

```
5. Add the following script to your `package.json` to start the server with nodemon:
```
"start": "nodemon index.js"
```
6. Start the server using the following command:
```
npm start
```
Your backend server will run on http://localhost:3001/.


## Add Affinidi Provider to the Express Server

To complete the OAuth 2.0 Code Grant flow with Affinidi, follow these steps:

1. Install the [@affinidi/passport-affinidi](https://www.npmjs.com/package/@affinidi/passport-affinidi) package:
```
npm install @affinidi/passport-affinidi
```
2. In your `index.js` file (inside the server-app folder), import the `@affinidi/passport-affinidi` package:
```
const { affinidiProvider } = require('@affinidi/passport-affinidi')
```
3. Initialize the Affinidi provider with your configuration settings
```
await affinidiProvider(app, {
    id: "affinidi",
    issuer: process.env.PROVIDER_ISSUER,
    client_id: process.env.PROVIDER_CLIENT_ID,
    client_secret: process.env.PROVIDER_CLIENT_SECRET,
    redirect_uris: ['http://localhost:3000/auth/callback']
});
```

You can find a sample index.js file [here](https://github.com/affinidi/affinidi-react-auth/blob/main/playground/server-app/index.js).

4. Create Login configuration using the link [here](https://docs.affinidi.com/docs/affinidi-login/login-configuration/#create-a-login-configuration) by giving name as `Affinidi Login App` and redirect-uri as `http://localhost:3000/auth/callback`

    Sample CLI Command 
    ```
    affinidi login create-config --name='Affinidi Login App' --redirect-uris='http://localhost:3000/auth/callback'
    ```

    Sample response
    ```
    {
        "ari:identity:ap-southeast-1:d085c5a5-5765-4d8f-b00e-398f0916a161:login_configuration/0143bf454065664893b030289ae17903",
        "projectId": "d085c5a5-5765-4d8f-b00e-398f0916a161",
        "id": "<LOGIN_CONFIG_ID>",
        "name": "Affinidi Login App",
        "auth": {
            "clientId": "<CLIENT_ID>",
            "clientSecret": "<CLIENT_SECRET>",
            "issuer": "<ISSUER>",
            "tokenEndpointAuthMethod": "client_secret_post"
        },
        "redirectUris": [
            "http://localhost:3000/auth/callback"
        ],
        "clientMetadata": {
            "name": "",
            "origin": "",
            "logo": ""
        },
        "creationDate": "2023-09-19T05:10:19Z"
    }

    ```

    **Important**: Keep the CLIENT_ID and CLIENT_SECRET safe that will be used later next step. Client Secret will only be displayed once.
    
5. Create a `.env` file in the `server-app` folder and add your Affinidi configuration obtained from previous step:
```
PROVIDER_CLIENT_ID="<CLIENT_ID>"
PROVIDER_CLIENT_SECRET="<CLIENT_SECRET>"
PROVIDER_ISSUER="<ISSUER>"
``` 
Sample `.env` file displayed below after respective values of the `CLIENT_ID`, `CLIENT_SECRET` and `ISSUER`
```
PROVIDER_CLIENT_ID="13456678c-67ac-429a-b0d3-5c64ec4c0577"
PROVIDER_CLIENT_SECRET="AbcdeF-odZtJ9tc3oLuWVW.ECE_"
PROVIDER_ISSUER="https://apse1.api.affinidi.io/vpa/v1/login/project/d085c5a5-5765-4d8f-b00e-398f0916a161"
```
6. Restart your server using `npm start`.

## Testing the Application

1. Open http://localhost:3000/ in your browser to check if the frontend application is running. If it's not running, go to the `client-app` folder in your terminal and run `npm start`.
2. Open http://localhost:3001/ in your browser to check if the backend server is running. If it's not running, go to the `server-app` folder in your terminal and run `npm start`.
3. Click the `Affinidi Login` button in the frontend app to start the login flow.


## Update Login Configuration to Retrieve Profile Information
By default, the login configuration requests only `Email` data. To also retrieve the `User Profile` data, follow these steps:
1. Create a file named `profile-pex.json` under `server-app` folder with the contents from [this file](https://github.com/affinidi/affinidi-react-auth/blob/main/playground/server-app/profile-pex.json) and open terminal
2. Execute the following command to update the login configuration, replacing `LOGIN_CONFIG_ID` with the value obtained in a previous step:
 
```
affinidi login update-config --id=LOGIN_CONFIG_ID --file=./profile-pex.json
``` 
Sample Command
```
affinidi login update-config --id=384192b3b3ea3df8cece307fda64cf98 --file=./profile-pex.json
```
Ensure that you have replaced `LOGIN_CONFIG_ID` with the actual ID from your configuration.

## Testing the Application with User Profile

Now that your login configuration is set up to request both `Email` and `User Profile` data, you can test the login flow to obtain profile information. Here are the steps:

1. Update your profile information in your Affinidi Vault.
2. Open the frontend application by navigating to http://localhost:3000/ in your web browser.
3. If you are already logged in, click on the Logout button to log out from the application. 
4. Now, click the `Affinidi Login` button again to initiate the login flow.
5. This time, you will receive user profile information as part of the login response.

