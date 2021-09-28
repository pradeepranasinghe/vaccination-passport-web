import React, { useState, useEffect, useRef } from "react"
import axios from 'axios';
import { handleResponse, handleError } from './response'
import { Spinner, Form, Container, Card, Button, Alert } from 'react-bootstrap'
import './landingPage.css';

const IssuePassport = (props) => {
  const connectionData = props.location && props.location.state || {};


  const [connections, setConnections] = useState();
  const connectionIdRef = useRef()
  const clientReferenceRef = useRef()
  const commentsRef = useRef()
  const clientFullNameRef = useRef()
  const ppIssueDateRef = useRef()
  const ppVaccinationTypeRef = useRef()
  const ppvalidFromRef = useRef()
  const ppvalidUntilRef = useRef()
  const ppFirstNameRef = useRef()
  const ppMiddleNameRef = useRef()
  const ppLastNameRef = useRef()
  const ppAgeRef = useRef()
  const ppVaccinationsRef = useRef()

  const clientAgeRef = useRef()
  const [refresh, setRefresh] = useState('');
  const [message, setMessage] = useState();
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const ISSUER_PUBLIC_DID = 'RcJY6pShAK5YwZJ55V1cGY';
  const SCHEMA_SEQ_NO =  "98979";
  

  //http://localhost:8021/connections?alias=Hello Alice 2
  useEffect(() => {
    connectionIdRef.current.value = connectionData.connection_id;
    clientReferenceRef.current.value = connectionData.alias;

  }, [refresh]);


  const getAll = (resource) => {
    return axios
      .get(`http://localhost:8021/connections`)
      .then(handleResponse)
      .catch(handleError);
  };

  const postCreateInvitation = (message) => {
    return axios
      .post(`http://localhost:8021/connections/create-invitation?alias=${message}&auto_accept=false&multi_use=false&public=false`)
      .then(handleResponse)
      .catch(handleError);
  };



  async function handleSubmit(e) {

    e.preventDefault();
    

    const attributes = [
      {
        "name": "middlename",
        "value": ppMiddleNameRef.current.value
      },
      {
        "name": "validuntil",
         "value": ppvalidUntilRef.current.value
      },
      {
        "name": "age",
        "value": ppAgeRef.current.value
      },
      {
        "name": "firstname",
        "value": ppFirstNameRef.current.value
      },
      {
        "name": "vaccinations",
        "value": ppVaccinationsRef.current.value
      },
      {
        "name": "validfrom",
        "value": ppvalidFromRef.current.value
      },
      {
        "name": "lastname",
        "value": ppLastNameRef.current.value
      },

    ]

    passportPayload.credential_preview.attributes = attributes;
    passportPayload.connection_id = connectionData.connection_id;
    passportPayload.comment = commentsRef.current.value

    issueCredential(passportPayload);

  }

  const issueCredential = (passportPayload) => {
    setLoading(true);
    return axios
      .post(`http://localhost:8021/issue-credential-2.0/send`,passportPayload)
      .then((res)=>{
        setMessage('Vaccination Passport has been issued successfully!')
        setLoading(false);
      })
      .catch((e)=>{
        setError('Error'+e);
        setLoading(false);
      });
  };

  const passportPayload = {
    "auto_remove": true,
    "comment": "test",
    "credential_preview": {
      "@type": "issue-credential/2.0/credential-preview",
    },
    "filter": {
      "indy": {
        "cred_def_id": `${ISSUER_PUBLIC_DID}:3:CL:${SCHEMA_SEQ_NO}:issuer.vacc.schema2`,
        "issuer_did": ISSUER_PUBLIC_DID,
        "schema_id": `${ISSUER_PUBLIC_DID}:2:vacc-pass-t2:0.0.2`,
        "schema_issuer_did": ISSUER_PUBLIC_DID,
        "schema_name": "vacc-pass-t2",
        "schema_version": "0.0.2"
      }
    },
    "trace": false
  };

  return (
    <>
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="w-100" style={{ maxWidth: "100%" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Issue a Passport</h2>
              <h4 className="text-center mb-4"></h4>
              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}
              {loading &&<Spinner animation="border" role="status">
                    <span className="sr-only">Writing to public ledger ...</span>
                </Spinner>}
              <Container className="invite-form">
                <Form onSubmit={handleSubmit}>
                  <Form.Group id="connectionId">
                    <Form.Label>Connection ID</Form.Label>
                    <Form.Control type="text" ref={connectionIdRef} required></Form.Control>
                  </Form.Group>
                  <Form.Group id="clientReference">
                    <Form.Label>Client Reference</Form.Label>
                    <Form.Control type="text" ref={clientReferenceRef} required></Form.Control>
                  </Form.Group>
                  <Form.Group id="clientMessage">
                    <Form.Label>Comments</Form.Label>
                    <Form.Control type="text" ref={commentsRef} required></Form.Control>
                  </Form.Group>
                  <Form.Group id="firtName">
                    <Form.Label>Client First Name</Form.Label>
                    <Form.Control type="text" ref={ppFirstNameRef} required></Form.Control>
                  </Form.Group>
                  <Form.Group id="middleName">
                    <Form.Label>Client Middle Name</Form.Label>
                    <Form.Control type="text" ref={ppMiddleNameRef}></Form.Control>
                  </Form.Group>
                  <Form.Group id="lastName">
                    <Form.Label>Client Last Name</Form.Label>
                    <Form.Control type="text" ref={ppLastNameRef} required></Form.Control>
                  </Form.Group>
                  <Form.Group id="dob">
                    <Form.Label>Client Age</Form.Label>
                    <Form.Control type="text" ref={ppAgeRef} required></Form.Control>
                  </Form.Group>
                  <Form.Group id="vaccinations">
                    <Form.Label>Vaccinations</Form.Label>
                    <Form.Control type="text" ref={ppVaccinationsRef} required></Form.Control>
                  </Form.Group>
                  <Form.Group id="validFrom">
                    <Form.Label>Vaccination Date format: YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS.</Form.Label>
                    <Form.Control type="text" ref={ppvalidFromRef} required></Form.Control>
                  </Form.Group>
                  <Form.Group id="validUntil">
                    <Form.Label>Vaccination Valid Until format: YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS.</Form.Label>
                    <Form.Control type="text" ref={ppvalidUntilRef}></Form.Control>
                  </Form.Group>
                  <Button variant="primary" type="submit">Issue</Button>
                </Form>
              </Container>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>

  )
}

export default IssuePassport;
