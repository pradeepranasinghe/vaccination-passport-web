import React, { useState, useEffect, useRef } from "react"
import axios from 'axios';
import { handleResponse, handleError } from './response'
import { Spinner, Form, Container, Card, Button, Alert } from 'react-bootstrap'
import './landingPage.css';

const IssuePassport = (props) => {
  const connectionData = props.location.state || {};


  const [connections, setConnections] = useState();
  const connectionIdRef = useRef()
  const clientReferenceRef = useRef()
  const commentsRef = useRef()
  const clientFullNameRef = useRef()
  const ppIssueDateRef = useRef()
  const ppVaccinationTypeRef = useRef()
  const clientAgeRef = useRef()
  const [refresh, setRefresh] = useState('');
  const [message, setMessage] = useState();
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  

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
        "name": "name",
        "value": clientFullNameRef.current.value
      },
      {
        "name": "timestamp",
        "value": "1234567890"
      },
      {
        "name": "date",
        "value": ppIssueDateRef.current.value
      },
      {
        "name": "degree",
        "value": ppVaccinationTypeRef.current.value
      },
      {
        "name": "age",
        "value": clientAgeRef.current.value
      }

    ]

    passportPayload.credential_preview.attributes = attributes;
    passportPayload.connection_id = connectionData.connection_id;

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
        "cred_def_id": "5GtAQvru5EM1uoh1fvBkfz:3:CL:94455:faber.agent.degree_schema",
        "issuer_did": "5GtAQvru5EM1uoh1fvBkfz",
        "schema_id": "5GtAQvru5EM1uoh1fvBkfz:2:degree schema:91.88.15",
        "schema_issuer_did": "5GtAQvru5EM1uoh1fvBkfz",
        "schema_name": "degree schema",
        "schema_version": "91.88.15"
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
              <h2 className="text-center mb-4">Issue Passport</h2>
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
                    <Form.Control type="text" ref={commentsRef}></Form.Control>
                  </Form.Group>
                  <Form.Group id="fullName">
                    <Form.Label>Client Full Name</Form.Label>
                    <Form.Control type="text" ref={clientFullNameRef} required></Form.Control>
                  </Form.Group>
                  <Form.Group id="age">
                    <Form.Label>Client Age</Form.Label>
                    <Form.Control type="text" ref={clientAgeRef} required></Form.Control>
                  </Form.Group>
                  <Form.Group id="vaccType">
                    <Form.Label>Type of Vaccination</Form.Label>
                    <Form.Control type="text" ref={ppVaccinationTypeRef} required></Form.Control>
                  </Form.Group>
                  <Form.Group id="issueDate">
                    <Form.Label>Date Passport Issued</Form.Label>
                    <Form.Control type="text" ref={ppIssueDateRef} required></Form.Control>
                  </Form.Group>
                  <Button variant="primary" type="submit">Issue Passport</Button>
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
