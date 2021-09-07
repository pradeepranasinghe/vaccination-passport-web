import React from 'react'
// import { ReactComponent as ReactLogo } from '../../icons/logout.svg';
import { Button, Nav, Navbar, Form, FormControl } from "react-bootstrap"
import { useAuth } from '../contexts/AuthContext'
import '../style.css'
import { LinkContainer } from 'react-router-bootstrap'
import { useHistory } from "react-router-dom"
import { useState, useEffect } from "react"



export default function Navigation() {

  const history = useHistory()
  const { currentUser, logout } = useAuth() || {}
  const [error, setError] = useState("")
  function handleLogout() {
    setError("")
    // console.log('res.results',sheet.feed.xmlns)
    console.log('logout')
    try {
      logout()
       localStorage.clear();
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }

  const [isChild, setIsChild] = useState(false)
  const [isParent, setIsParent] = useState(false)

  

  useEffect(() => {
  
  }, []);




  // const { currentUser } = useAuth() || {}
  return (
    currentUser ?
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Learner~Space</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">

            <LinkContainer to="/child">
              <Nav.Link>Dashboard</Nav.Link>
            </LinkContainer>
            


          </Nav>
          {/* <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form> */}
          <span>{currentUser.email}</span>
          <Nav.Link href="#" className="loglink"></Nav.Link>
        </Navbar.Collapse>
       
      </Navbar> : <div />
  )
}
