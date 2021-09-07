import React, { useState, useEffect, useRef } from "react"
import axios from 'axios';
import { handleResponse, handleError } from './response'
import { Table, Form, Container, Card, Button, Alert } from 'react-bootstrap'
import './landingPage.css';
import { Link, useHistory } from "react-router-dom"

function LandingPage() {


  const [connections, setConnections] = useState();
  const invitationRef = useRef()
  const connectionRef = useRef()
  const [refresh, setRefresh] = useState('');
  const [message, setMessage] = useState();
  const [error, setError] = useState()


  //http://localhost:8021/connections?alias=Hello Alice 2
  useEffect(() => {
    getAll().then((res) => {
      setConnections(res.results);
      console.log('data', res);
    })



  }, [refresh]);

  const history = useHistory();

  const handleClickIssue = (connection) => {
    history.push({
      pathname: '/issue',
      state: connection
    });
  }


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
    postCreateInvitation(invitationRef.current.value).then((invite) => {

      connectionRef.current.value = JSON.stringify(invite.invitation);
      setRefresh({ ...1 })
    })


    console.log('invitationRef', invitationRef.current.value);
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
              <h2 className="text-center mb-4">Vaccination Passport Issuer</h2>
              <h4 className="text-center mb-4">Agent's private blockchain wallet</h4>
              <Container className="invite-form">
                <ol>
                  <div>
                    <h4>Passport issuer steps</h4>

                    <li>Send an invitation to the Client to establish a secure connection before issuing the passport. Eg: via Email</li>
                    <span className="spacer"></span>
                  </div>

                  <Form onSubmit={handleSubmit}>
                    <Form.Group id="message">
                      <Form.Label>Invitation message</Form.Label>
                      <Form.Control type="text" ref={invitationRef} required></Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit">Generate Connection</Button>
                    <span className="spacer"></span>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Secure Connection Details for Client</Form.Label>
                      <Form.Control as="textarea" ref={connectionRef} rows={3} />
                    </Form.Group>
                  </Form>
                  <div>
                    <p>Copy this response details with the client via Email or Text</p>

                    <li>Click <b>Accpet</b> button from the table to establish a secure connection with the Client</li>

                  </div>
                </ol>
              </Container>
              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Connection ID</th>
                    <th>Message Sent</th>
                    <th>Client</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {connections && connections.length > 0 ?
                    connections.map((conn) => (
                      <tr>
                        <td>{conn.connection_id}</td>
                        <td>{conn.alias}</td>
                        <td>{conn.their_label}</td>
                        <td>{conn.rfc23_state}</td>
                        <td>{
                        (conn.rfc23_state && conn.rfc23_state == 'request-received') && 
                        <Button variant="primary" onClick={() => { handleAcceptRequest(conn.connection_id) }} type="button">Accpet</Button>}
                        {(conn.rfc23_state && conn.rfc23_state == 'response-sent') && 
                        <Button variant="primary" onClick={() => { handleClickIssue(conn) }} type="button">Issue</Button>}
                      </td>
                      </tr>

                    )) : ''}
                </tbody>
              </Table>

            </Card.Body>
          </Card>
        </div>
      </Container>
    </>

  )
}

export default LandingPage;
