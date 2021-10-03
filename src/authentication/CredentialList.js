import React, { useState, useEffect, useRef } from "react"
import axios from 'axios';
import { handleResponse, handleError } from './response'
import { Table, Spinner, Container, Card, Button, Alert } from 'react-bootstrap'
import './landingPage.css';
import { Link } from "react-router-dom";
import RowRederer from './RowRederer'

function CredentialList() {


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
            console.log('data', res);
        })

    }, [refresh]);


    const getAll = (resource) => {
        return axios
            .get(`http://localhost:8021/issue-credential-2.0/records`)
            .then(handleResponse)
            .catch(handleError);
    };

    const getPresentProofRequest =  (conn) => {

        console.log('conn.cred_ex_record....',conn.cred_ex_record.by_format.cred_offer.indy.cred_def_id);

        return {
            "comment": getDisplayString2(conn.cred_ex_record.cred_offer.credential_preview.attributes),
            "connection_id": conn.cred_ex_record.connection_id,
            "presentation_request": {
                "indy": {
                    "name": "Proof of Vaccination",
                    "version": "0.0.2",
                    "requested_attributes": {
                        "0_firstname_uuid": {
                            "name": "firstname",
                            "restrictions": [
                                {
                                    "cred_def_id": conn.cred_ex_record.by_format.cred_offer.indy.cred_def_id
                                }
                            ]
                        },
                        "0_lastname_uuid": {
                            "name": "lastname",
                            "restrictions": [
                                {
                                    "cred_def_id": conn.cred_ex_record.by_format.cred_offer.indy.cred_def_id
                                }
                            ]
                        },
                    },
                    "requested_predicates": 
                    {
                        // "0_age_GE_uuid": {
                        //     "name": "age",
                        //     "p_type": "<=",
                        //     "p_value": 18,
                        //     "restrictions": [
                        //         {
                        //             "cred_def_id": conn.cred_ex_record.by_format.cred_offer.indy.cred_def_id
                        //         }
                        //     ]
                        // }
                    }
                }
            }
        }
    }


    const handlePresentProof =  (conn) => {


        setLoading(true)
        let ppr =  getPresentProofRequest(conn);
        console.log(ppr);
        return axios
            .post(`http://localhost:8021/present-proof-2.0/send-request`, ppr)
            .then((res) => {
                setMessage('Request for Proof sent successfully!')
                setLoading(false);
                // getVerificationStatus(res).then((res)=>{
                //     console.log('Present proof response11', res);
                //     setVerificationStatus(res);
                // })
                
            })
            .catch((e) => {
                setError('Error' + e);
                setLoading(false);
            });
    };

    const getDisplayString = (items)=>{
        let temp='';
        items.map((item)=>{
            temp += `<p>${(item.name||'')} : ${item.value}</p>`;
        })
        return temp;
    }

    const getDisplayString2 = (items)=>{
        let temp='';
        items.map((item)=>{
            temp += `${(item.name||'')} : ${item.value}`;
        })
        return temp;
    }


    return (
        <>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            {loading && <Spinner animation="border" role="status">
                <span className="sr-only">Requesting proof ...</span>
            </Spinner>}

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Connection ID</th>
                        {/* <th className="column-width">cred_def_id</th> */}
                        <th>Agent</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {connections && connections.length > 0 ?
                        connections.map((conn) => (
                            <tr>
                                <td>{conn.cred_ex_record.connection_id}</td>
                                {/* <td className="column-width">{conn.cred_ex_record.by_format.cred_offer.indy.cred_def_id}</td> */}
                                {/* <td><RowRederer items={conn.cred_ex_record.cred_offer.credential_preview.attributes}/></td> */}
                                <td dangerouslySetInnerHTML={{ __html: getDisplayString(conn.cred_ex_record.cred_offer.credential_preview.attributes)}}></td>
                                <td>{conn.cred_ex_record.state}</td>
                                <td><Button variant="primary" onClick={() => { handlePresentProof(conn) }} type="button">Request Proof</Button></td>
                            </tr>

                        )) : ''}
                </tbody>
            </Table>

        </>

    )
}

export default CredentialList;
