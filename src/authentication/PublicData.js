import React, { useState, useEffect, useRef } from "react"
import axios from 'axios';
import { handleResponse, handleError } from './response'
import { Table, Form, Container, Card, Button, Alert } from 'react-bootstrap'
import './landingPage.css';
import { Link } from "react-router-dom";

function PublicData() {


  const [credefs, setCredDefs] = useState();
  const [schemaDefs, setSchemaDefs] = useState();

  useEffect(() => {
    getAll().then((res) => {
      setCredDefs(res.credential_definition_ids);
    })
    getAll2().then((res) => {
      setSchemaDefs(res.schema_ids);
    })

  }, []);


  const getAll = (resource) => {
    return axios
      .get(`http://localhost:8021/credential-definitions/created`)
      .then(handleResponse)
      .catch(handleError);
  };

  const getAll2 = (resource) => {
    return axios
      .get(`http://localhost:8021/schemas/created`)
      .then(handleResponse)
      .catch(handleError);
  };


  return (
    <>
      <p><b>The following Credential Definitions are for the Proof Verification Agencies </b></p>
      {credefs && credefs.map((cre_def) => <p>{cre_def}</p>)}
      <p><b>The following Schema Definitions are for the Proof Verification Agencies </b></p>
      {schemaDefs && schemaDefs.map((cre_def) => <p>{cre_def}</p>)}

    </>


  )
}
export default PublicData;
