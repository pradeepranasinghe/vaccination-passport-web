import React, { useState, useEffect, useRef } from "react"
import axios from 'axios';
import { handleResponse, handleError } from './response'
import { Table, Spinner, Container, Card, Button, Alert } from 'react-bootstrap'
import './landingPage.css';

function ClaimHolderRecords() {


  const [connections, setConnections] = useState();
  const [refresh, setRefresh] = useState('');
  const connectionRef = useRef()
  const [message, setMessage] = useState();
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAll().then((res) => {
      setConnections(res.results);
      console.log('data', res);
    })

  }, [refresh]);


  const getAll = (resource) => {
    return axios
      .get(`http://localhost:8031/issue-credential-2.0/records`)
      .then(handleResponse)
      .catch(handleError);
  };



  const storeCredential = (cred_ex_id) => {
    setLoading(true)
    return axios
      .post(`http://localhost:8031/issue-credential-2.0/records/${cred_ex_id}/store`)
      .then((res) => {
        setMessage('Vaccination Passport Stored in Wallet successfully!')
        setLoading(false);
      })
      .catch((e) => {
        setError('Error' + e);
        setLoading(false);
      });
  };


  async function handleClickStore(cred_ex_id) {
    storeCredential(cred_ex_id);
    setRefresh({...1})
  }


  return (
    <>
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="w-100" style={{ maxWidth: "100%" }}>
          {loading && <Spinner animation="border" role="status">
            <span className="sr-only">Writing to public ledger ...</span>
          </Spinner>}
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">My Vaccination Passports</h2>
              <h4 className="text-center mb-4"></h4>
              <Container className="invite-form">
                <div>
                  <p>Click Store button to store your vaccination passport in the Wallet.</p>
                </div>
                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}

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
                        <td>{conn.cred_ex_record.cred_ex_id}</td>
                        <td>{JSON.stringify(conn.cred_ex_record.cred_offer.credential_preview.attributes)}</td>
                        <td>{conn.cred_ex_record.state}</td>
                        <td>{(conn.cred_ex_record.state == 'credential-received') &&
                          <Button variant="primary" onClick={() => { handleClickStore(conn.cred_ex_record.cred_ex_id) }} type="button">Store</Button>}</td>
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

export default ClaimHolderRecords;
