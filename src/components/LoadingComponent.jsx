import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-bootstrap'
import ReactLoading from 'react-loading';

const LoadingComponent = (props) => {
  return (
    <Row className="justify-content-center align-items-center">
      <Col sm={2} md={2} lg={2} className="text-center">
        <ReactLoading type={"balls"} color={"yellow"} width={'100%'} />
        <br/><br/><br/>
        Cargando...
      </Col>
    </Row>
  )
}

export default LoadingComponent
