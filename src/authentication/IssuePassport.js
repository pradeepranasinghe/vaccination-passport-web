import React, { useState, useEffect, useRef } from "react"
import axios from 'axios';
import { handleResponse, handleError } from './response'
import { Table, Form, Container, Card, Button, Alert } from 'react-bootstrap'
import './landingPage.css';

const IssuePassport = (props) => {
  const connectionData = props.location.state || {};


  const [connections, setConnections] = useState();
  const connectionIdRef = useRef()
  const clientReferenceRef = useRef()
  const clientFullNameRef = useRef()
  const ppIssueDate = useRef()
  const ppVaccinationType = useRef()
  const clientAge = useRef()
  const [refresh, setRefresh] = useState('');
  const [message, setMessage] = useState();
  const [error, setError] = useState()


  //http://localhost:8021/connections?alias=Hello Alice 2
  useEffect(() => {
    getAll().then((res) => {
      setConnections(res.results);
      console.log('data', res);
    })

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
    // postCreateInvitation(invitationRef.current.value).then((invite) => {

    //   connectionRef.current.value = JSON.stringify(invite.invitation);
    //   setRefresh({ ...1 })
    // })

  }

  const acceptRequest = (connection_id) => {
    return axios
      .post(`http://localhost:8021/connections/${connection_id}/accept-request`)
      .then(handleResponse)
      .catch(handleError);
  };


  function handleAcceptRequest(connection_id) {
    acceptRequest(connection_id).then((res2) => {
      setMessage('Client Request Accepted Successfully!')
    });
    //setRefresh({...1})
  }



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
                  <Form.Group id="fullName">
                    <Form.Label>Client Full Name</Form.Label>
                    <Form.Control type="text" ref={clientFullNameRef} required></Form.Control>
                  </Form.Group>
                  <Form.Group id="age">
                    <Form.Label>Client Age</Form.Label>
                    <Form.Control type="text" ref={clientAge} required></Form.Control>
                  </Form.Group>
                  <Form.Group id="vaccType">
                    <Form.Label>Type of Vaccination</Form.Label>
                    <Form.Control type="text" ref={ppVaccinationType} required></Form.Control>
                  </Form.Group>
                  <Form.Group id="issueDate">
                    <Form.Label>Date Passport Issued</Form.Label>
                    <Form.Control type="text" ref={ppIssueDate} required></Form.Control>
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
