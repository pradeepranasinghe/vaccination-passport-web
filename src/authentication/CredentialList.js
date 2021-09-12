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

        return {
            "comment": getDisplayString2(conn.cred_ex_record.cred_offer.credential_preview.attributes),
            "connection_id": conn.cred_ex_record.connection_id,
            "presentation_request": {
                "indy": {
                    "name": "Proof of Education",
                    "version": "1.0",
                    "requested_attributes": {
                        "0_name_uuid": {
                            "name": "name",
                            "restrictions": [
                                {
                                    "cred_def_id": conn.cred_ex_record.by_format.cred_offer.indy.cred_def_id
                                }
                            ]
                        },
                        "0_date_uuid": {
                            "name": "date",
                            "restrictions": [
                                {
                                    "cred_def_id": conn.cred_ex_record.by_format.cred_offer.indy.cred_def_id
                                }
                            ]
                        },
                        "0_degree_uuid": {
                            "name": "degree",
                            "restrictions": [
                                {
                                    "cred_def_id": conn.cred_ex_record.by_format.cred_offer.indy.cred_def_id
                                }
                            ]
                        },
                        "0_self_attested_thing_uuid": {
                            "name": "self_attested_thing"
                        }
                    },
                    "requested_predicates": {
                        "0_age_GE_uuid": {
                            "name": "age",
                            "p_type": ">=",
                            "p_value": 18,
                            "restrictions": [
                                {
                                    "cred_def_id": conn.cred_ex_record.by_format.cred_offer.indy.cred_def_id
                                }
                            ]
                        }
                    }
                }
            }
        }
    }

    // const getVerificationStatus = (res) => {
    //     let pres_ex_id = res.data.pres_ex_id;
    //     // return axios
    //     //     .get(`http://localhost:8021/present-proof-2.0/records/${pres_ex_id}`)
    //     //     .then(handleResponse)
    //     //     .catch(handleError);

    //     //http://localhost:8021/present-proof-2.0/records

    //     var xhttp = new XMLHttpRequest();
    //     xhttp.onreadystatechange = function() {
    //         if (this.readyState == 4 && this.status == 200) {
    //         // Typical action to be performed when the document is ready:
    //             console.log('what s',JSON.parse(xhttp.responseText))
    //         }

    //     };
    //     xhttp.open("GET", `http://localhost:8021/present-proof-2.0/records/${pres_ex_id}`, true);
    //     xhttp.send();
    // }


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
            temp += `<p>${(item.name||'')}  ${item.value}</p>`;
        })
        return temp;
    }

    const getDisplayString2 = (items)=>{
        let temp='';
        items.map((item)=>{
            temp += `${(item.name||'')}  ${item.value}`;
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
