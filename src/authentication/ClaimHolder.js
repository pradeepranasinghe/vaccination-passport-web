import React, { useState, useEffect,useRef } from "react"
import axios from 'axios';
import { handleResponse, handleError } from './response'
import { Table, Form, Container, Card, Button, Alert } from 'react-bootstrap'
import './landingPage.css';

function ClaimHolder() {


  const [connections, setConnections] = useState();
  const [refresh,setRefresh] = useState('');
  const connectionRef = useRef()
  const [message, setMessage] = useState();
  const [error, setError] = useState()

  useEffect(() => {
    getAll().then((res) => {
      setConnections(res.results);
      console.log('data',res);
    })

  }, [refresh]);


  const getAll = (resource) => {
    return axios
      .get(`http://localhost:8031/connections`)
      .then(handleResponse)
      .catch(handleError);
  };

  

  const acceptInvitation = (connection_id) => {
    return axios
      .post(`http://localhost:8031/connections/${connection_id}/accept-invitation`)
      .then(handleResponse)
      .catch(handleError);
  };

  const receiveInvitation = (message) => {
    return axios
      .post(`http://localhost:8031/connections/receive-invitation`,message)
      .then(handleResponse)
      .catch(handleError);
  };


  async function handleSubmit(e) {
    e.preventDefault();
    receiveInvitation(connectionRef.current.value).then((res)=>{
      console.log(res);
      acceptInvitation(res.connection_id).then((res2)=>{
        setMessage('Connection Accepted and Notified Agent Successfully!')
      });
      
      setRefresh({...1})
    })

    
  }


  return (
    <>
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="w-100" style={{ maxWidth: "100%" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Passport Holder's Wallet</h2>
              <h4 className="text-center mb-4">Self-sovereign identitiy (SSI)</h4>
              <Container className="invite-form">
              <div>
                <p>Receiving a secure connection invitation from an Agent via Email or Text</p>
                <ul>
                <li>Accept Invitation to securely store a credential</li>
                </ul>
                </div> 
                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Secure Connection Details for Client</Form.Label>
                    <Form.Control as="textarea" ref={connectionRef} rows={3} />
                  </Form.Group>
                  <Button variant="primary" type="submit">Accpet Connection</Button>
                </Form>
                </Container>  
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Connection ID</th>
                    <th>Agent</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {connections && connections.length > 0 ?
                    connections.map((conn) => (
                      <tr>
                        <td>{conn.connection_id}</td>
                        <td>{conn.their_label}</td>
                        <td>{conn.rfc23_state}</td>                        
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

export default ClaimHolder;
