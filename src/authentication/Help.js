import React, { useRef, useState, useEffect } from 'react'
import { Form, Button, Card, Alert, Container } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'


export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    // const { login } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);
    const history = useHistory();
   
    
    async function handleSubmit(e) {
        if(emailRef.current.value.startsWith('iss'))
            history.push("/landing")
        if(emailRef.current.value.startsWith('hol'))
            history.push("/claimholder")

        setLoading(false)
    }

    return (
        <>
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <div className="w-100" style={{ width: "100%" }}>
                    <Card>
                        <Card.Body>
                             <h4>Pre-configured Steps of the Passport Issuer Agent</h4>   
                            <p>
                                <ul>
                                    <li>registered a public DID and stored it on the ledger;</li>
                                    <li>created a schema and registered it on the ledger;</li>
                                    <li>created a credential definition and registered it on the ledger.</li>
                                    
                                </ul>
                                


</p>
<h4>Items (Transactions) available in the Public <a href="http://dev.greenlight.bcovrin.vonx.io/">Ledger</a> for the Claim Issuer Agent </h4>   
<p>




<ul>
<li>the initial DID registration</li>
<li>registration of the DID endpoint (Faber is an issuer so it has a public endpoint)</li>
<li>the registered schema</li>
<li>the registered credential definition</li>
</ul>

</p>

                        </Card.Body>
                    </Card>
                </div>
            </Container>
        </>
    )
}