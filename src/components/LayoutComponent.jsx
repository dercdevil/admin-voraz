import React from 'react'
import PropTypes from 'prop-types'
import NavbarComponent from './NavbarComponent'
import {Container, Row, Col} from 'react-bootstrap'
const LayoutComponent = (props) => {
  return (
    <Container fluid>
      <Row>
        <Col>
          <NavbarComponent {...props}/>
        </Col>
      </Row>
      {props.children}
    </Container>

  )
}

export default LayoutComponent
