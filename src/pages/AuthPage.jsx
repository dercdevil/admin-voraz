import React, { useEffect, useRef, useState } from 'react'
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap'
import InputFieldRef from '../components/input/InputComponentRef'
import InputField from '../components/input/InputComponent'
import { setAuthorizationToken, formatRut } from '../utils/functions'
import axios from 'axios'
import {API_URL} from '../utils/constants'
import { ToastContainer, toast } from 'react-toastify'
import '../assets/css/authPage.css'
import LoadingComponent from '../components/LoadingComponent'

const AuthPage = (props) => {

  const [data, setData] = useState({
    email: "",
    password : "",
    rut : "",
  })
  const [ validated, setValidated ] = useState(false)
  const [recoverdEmail, setRecoverdEmail] = useState(false)
  const [isLoading,setIsLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() =>{
    if(inputRef){
      inputRef.current.focus()
    }
  },[inputRef])

  const onChange = e => {
    setData({...data, [e.target.name] : e.target.name === "rut" ? formatRut(e.target.value) : e.target.value })
  }

  const handleSubmit = e => {

    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return
    }

    let dataPost = Object.assign({},data)
    setIsLoading(true)

    axios.post(API_URL+'login',dataPost).then(result => {
      toast.success('Usuario autenticado con éxito')
      localStorage.setItem('tokenApp',result.data.token)
      localStorage.setItem('userApp',JSON.stringify(result.data.user))
      setAuthorizationToken(result.data.token)
      setIsLoading(false)
      setTimeout(function () {
        props.history.replace('/dashboard')
      }, 1500);
    }).catch(err => {
      setIsLoading(false)
      const { response } = err
      if(response){
        toast.error(response.data.message)
      }else{
        toast.error('Error, contacte con soporte')
      }
    })
  }

  const handleEmailSubmit = e => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return
    }
    setIsLoading(true)
    let dataPost = Object.assign({},data)

    axios.post(API_URL+'auth_recovery_pass',dataPost).then(result => {
      toast.success('Ha sido enviada una nueva contraseña a su correo')
      setIsLoading(false)
      recoverEmail()
    }).catch(err => {
      setIsLoading(false)
      const { response } = err
      if(response){
        toast.error(response.data.message)
      }else{
        toast.error('Error, contacte con soporte')
      }
    })
  }

  const recoverEmail = () => {
    setRecoverdEmail(!recoverdEmail)
  }

  return (
    <Container fluid>
      <Row className="justify-content-center align-items-center" style={{height: '720px'}}>
        <Col sm={5} md={5} lg={5} className="boxLogin" style={{backgroundColor:"#f3f4ed", borderRadius:"20px"}}>
          <Row>
            <Col className="text-center">
              <Image src={require('../assets/img/logo.png').default}
                width="150"
                className="d-inline-block align-top"
                alt="React Bootstrap logo"
              />
            </Col>
          </Row>
          <>
            {isLoading ? (
              <LoadingComponent />
            ) : (
              <>
                {recoverdEmail ? (
                  <Form onSubmit={handleEmailSubmit} noValidate validated={validated}>
                    <Row>
                      <Col>
                        <h3 className="text-center">Recuperar Contraseña</h3>
                      </Col>
                    </Row>
                    <Row>
                      <InputFieldRef
                        ref={inputRef}
                        type='email'
                        label='Email'
                        name='email'
                        required={true}
                        messageErrors={[
                          '*Requerido ','*Formato tipo email'
                        ]}
                        cols='col-md-12 col-lg-12 col-sm-12'
                        value={data.email}
                        handleChange={onChange}
                        />
                    </Row>
                    <Row>
                      <Col>
                        <Button variant="primary" block={true} size="sm" type="submit">Enviar</Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Button variant="link" block={true} size="sm" type="button" onClick={recoverEmail}>Ir al login</Button>
                      </Col>
                    </Row>
                  </Form>
                ) : (
                  <Form onSubmit={handleSubmit} noValidate validated={validated}>
                    <Row>
                      <InputFieldRef
                        ref={inputRef}
                        type='text'
                        label='Rut'
                        name='rut'
                        required={true}
                        messageErrors={[
                          '*Requerido'
                        ]}
                        cols='col-md-12 col-lg-12 col-sm-12'
                        value={data.rut}
                        handleChange={onChange}
                        />
                    </Row>
                    <Row>
                      <InputField
                        type='password'
                        label='Password'
                        name='password'
                        required={true}
                        messageErrors={[
                          '*Requerido '
                        ]}
                        cols='col-md-12 col-lg-12 col-sm-12'
                        value={data.password}
                        handleChange={onChange}
                        />
                    </Row>
                    <Row>
                      <Col>
                        <Button variant="primary" block={true} size="sm" type="submit">Entrar</Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Button variant="link" block={true} size="sm" type="button" onClick={recoverEmail}>Recuperar Contraseña</Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </>
            )}
          </>

        </Col>
      </Row>
      <ToastContainer />
    </Container>
  )
}

export default AuthPage
