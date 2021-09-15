import React, { useState, useEffect, useRef } from "react"
import axios from 'axios';
import { handleResponse, handleError } from './response'
import { Table, Spinner, Container, Card, Button, Alert } from 'react-bootstrap'
import './landingPage.css';
import { Link } from "react-router-dom";
import RowRederer from './RowRederer'

function ProofRequestList(isIssuer) {


    const [connections, setConnections] = useState();
    const [refresh, setRefresh] = useState('');
    const connectionRef = useRef()
    const [message, setMessage] = useState();
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const [verificationStatus, setVerificationStatus] = useState();

    useEffect(() => {
        getAll().then((res) => {
            setConnections(res.results);
        })

    }, [refresh]);


    const getAll = () => {
        let port = isIssuer.isIssuer == true ? '8021':'8041';
        
        return axios
            .get(`http://localhost:${port}/present-proof-2.0/records`)
            .then(handleResponse)
            .catch(handleError);
    };


    return (
        <>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            {loading && <Spinner animation="border" role="status">
                <span className="sr-only">Requesting proof ...</span>
            </Spinner>}

            {verificationStatus && <div className="verificationStatus">
                <h6>Verification Status: {verificationStatus.verified}</h6>
            </div>}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Connection ID</th>
                        {/* <th className="column-width">cred_def_id</th> */}
                        <th>Comment</th>
                        <th>Proof Presentation ID</th>
                        
                        <th>Status</th>
                        <th>Proof verified</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {connections && connections.length > 0 ?
                        connections.map((conn) => (
                            <tr>
                                <td>{conn.connection_id}</td>
                                {/* <td className="column-width">{conn.cred_ex_record.by_format.cred_offer.indy.cred_def_id}</td> */}
                                {/* <td><RowRederer items={conn.cred_ex_record.cred_offer.credential_preview.attributes}/></td> */}
                                <td>{conn.pres_request.comment}</td>
                                <td>{conn.pres_ex_id}</td>
                                <td>{conn.state}</td>
                                <td>{conn.verified}</td>
                                <td></td>
                            </tr>

                        )) : ''}
                </tbody>
            </Table>
<p>TODO: http://localhost:8041/present-proof-2.0/records/3c148235-413d-439b-a70f-10ffa7da2830/verify-presentation

    Proof verification with multiple credentials in holder's wallet.
</p>
        </>

    )
}

export default ProofRequestList;
