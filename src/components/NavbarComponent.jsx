import React from 'react'
import PropTypes from 'prop-types'
import { Navbar,Nav,Image } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import { setAuthorizationToken } from '../utils/functions'

const NavbarComponent = (props) => {

  const logout = (e) => {
    e.preventDefault()
    localStorage.removeItem('tokenApp')
    localStorage.removeItem('userApp')
    setAuthorizationToken(null)
    document.getElementById("linkDh").click()
  }

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand as={Link} to="/"><Image src={require('../assets/img/logo.png').default} width="100" /></Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link as={Link} to="/dashboard" style={{color: "white"}}>Dashboard</Nav.Link>
        <Nav.Link as={Link} to="/product_premium" style={{color: "white"}}>Productos</Nav.Link>
        <Nav.Link as={Link} to="/payments" style={{color: "white"}}>Pedidos</Nav.Link>
        <Nav.Link as={Link} to="/coupons" style={{color: "white"}}>Cupones</Nav.Link>
        <Nav.Link as={Link} to="/categorys" style={{color: "white"}}>Categorias</Nav.Link>
        <Nav.Link as={Link} to="/register" style={{color: "white"}}>Nueva Tienda</Nav.Link>
        <Nav.Link as={Link} to="/" style={{display: "none"}} id="linkDh"></Nav.Link>
      </Nav>
      <Nav className="align-items-lg-center ml-auto">
        <Nav.Link as={Link} to="/profile" style={{color: "white"}}>Perfil</Nav.Link>
        <Nav.Link as={"a"} href="" onClick={logout} style={{color: "white"}}>Salir</Nav.Link>
      </Nav>
  </Navbar>
  )
}

export default NavbarComponent
