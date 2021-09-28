# Blockchain based Vaccination Passport using Self-sovereign identity with Hyperledger technology 

Generally, Health records are kept in disparate but centralised database systems. These systems are vulnerable to data theft, cyber-attacks, fraud, blackmailing, and many other privacy issues. In addition to that, users of these systems need to maintain multiple user accounts and they don’t have any control over their data stored in these systems. In this paper, we will evaluate the usability of blockchain technologies for vendor-neutral decentralised identity management, access controls, and costs effective platforms to build a portable, user-centred tamper-proof vaccination passport that can be accessed from anywhere in the world.

Notes:

Adds --auto-store-credential to the demo Alice agents


## This is a Web Application Artefact developed to orchestrate Passport Issuer, Holder, and Verifier credential exchange scenarios

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Starting Agents:



1) Checkout GITHUB project:

https://github.com/hyperledger/aries-cloudagent-python.git

2) cd demo

3) Start Faber, Alice , Acme in seperate Tabs 

4) start agents in seperate tabs

tab1) LEDGER_URL=http://dev.greenlight.bcovrin.vonx.io ./run_demo faber --events --no-auto --bg

tab2) LEDGER_URL=http://dev.greenlight.bcovrin.vonx.io ./run_demo faber --events --no-auto --bg

tab3 ) LEDGER_URL=http://dev.greenlight.bcovrin.vonx.io ./run_demo faber --events --no-auto --bg

5) check logs in each tab: 

tab1) docker logs faber
tab2) docker logs alice
tab3) docker logs acme

6) open swaggers: 

faber
http://localhost:8021/api/doc
alice
http://localhost:8031/api/doc
acme
http://localhost:8041/api/doc

7) create schema and credentials

## create schema

POST: http://localhost:8021/schemas
req: 

{
  "attributes": [
    "firstname","middlename","lastname","age","validfrom", "validuntil", "vaccinations"
  ],
  "schema_name": "vacc-pass-t2",
  "schema_version": "0.0.2"
}
res: 

{
  "schema_id": "RcJY6pShAK5YwZJ55V1cGY:2:vacc-pass-t2:0.0.2",
  "schema": {
    "ver": "1.0",
    "id": "RcJY6pShAK5YwZJ55V1cGY:2:vacc-pass-t2:0.0.2",
    "name": "vacc-pass-t2",
    "version": "0.0.2",
    "attrNames": [
      "middlename",
      "validuntil",
      "vaccinations",
      "firstname",
      "age",
      "lastname",
      "validfrom"
    ],
    "seqNo": 98979
  }
}

## create credential defintion 

POST: http://localhost:8021/credential-definitions

based on the response from the previous step: 
req: 

{
  "revocation_registry_size": 1000,
  "schema_id": "RcJY6pShAK5YwZJ55V1cGY:2:vacc-pass-t2:0.0.2",
  "support_revocation": false,
  "tag": "issuer.vacc.schema2"
}

res:

{
  "credential_definition_id": "RcJY6pShAK5YwZJ55V1cGY:3:CL:98979:issuer.vacc.schema2"
}

## Shutdown Agents

docker stop faber
docker stop alice
docker stop acme




