import React, { useState, useEffect, useRef } from "react"
import axios from 'axios';
import { handleResponse, handleError } from './response'
import { Spinner, Form, Container, Card, Button, Alert } from 'react-bootstrap'
import './landingPage.css';

const ProofRequest = (props) => {
  const connectionData = props.location && props.location.state || {};


  const [connections, setConnections] = useState();
  const connectionIdRef = useRef()
  const clientReferenceRef = useRef()
  const commentsRef = useRef()
  const credentialDefRef = useRef()
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
    credentialDefRef.current.value = '87AyScWhdSCvWFYBGGq2Xb:3:CL:96490:issuer.vacc.schema'

  }, [refresh]);


  const getPresentProofRequest =  () => {

    return {
        "comment": commentsRef.current.value,
        "connection_id": connectionIdRef.current.value,
        "presentation_request": {
            "indy": {
                "name": "Proof of Vaccination",
                "version": "1.0",
                "nonce": "12345",
                "requested_attributes": {
                    "0_name_uuid": {
                        "name": "firtname",
                        "restrictions": [
                            {
                                "cred_def_id": credentialDefRef.current.value
                            }
                        ]
                    },
                    "0_date_uuid": {
                        "name": "lastname",
                        "restrictions": [
                            {
                                "cred_def_id": credentialDefRef.current.value
                            }
                        ]
                    },
                    "0_degree_uuid": {
                        "name": "vaccinations",
                        "restrictions": [
                            {
                                "cred_def_id": credentialDefRef.current.value
                            }
                        ]
                    },
                    "0_self_attested_thing_uuid": {
                        "name": "dateofbirth"
                    }
                },
                "requested_predicates": {
                    "0_age_GE_uuid": {
                        "name": "vaccinations",
                        "p_type": ">",
                        "p_value": 30,
                        "restrictions": [
                            {
                                "cred_def_id": credentialDefRef.current.value
                            }
                        ]
                    }
                }
            }
        }
    }
}


const handleSubmit =  (e) => {

    e.preventDefault();
    setLoading(true)
    let ppr =  getPresentProofRequest();
    console.log(ppr);
    return axios
        .post(`http://localhost:8041/present-proof-2.0/send-request`, ppr)
        .then((res) => {
            setMessage('Request for Proof sent successfully!')
            setLoading(false);            
        })
        .catch((e) => {
            setError('Error' + e);
            setLoading(false);
        });
};


  return (
    <>
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="w-100" style={{ maxWidth: "100%" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Request Proof</h2>
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
                  <Form.Group id="credentialDef">
                    <Form.Label>Issuer's Credential Definition ID</Form.Label>
                    <Form.Control type="text" ref={credentialDefRef} required></Form.Control>
                  </Form.Group>
                  <Form.Group id="clientReference">
                    <Form.Label>Client Reference</Form.Label>
                    <Form.Control type="text" ref={clientReferenceRef} required></Form.Control>
                  </Form.Group>
                  <Form.Group id="clientMessage">
                    <Form.Label>Comments</Form.Label>
                    <Form.Control type="text" ref={commentsRef}></Form.Control>
                  </Form.Group>                  
                  <Button variant="primary" type="submit">Presentation Request</Button>
                </Form>
              </Container>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>

  )
}

export default ProofRequest;
