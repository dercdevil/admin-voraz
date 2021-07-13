import React, {useState, useEffect, useMemo, useRef} from 'react'
import PropTypes from 'prop-types'
import Table from '../components/Table'
import {Row, Col, Button,  Form} from 'react-bootstrap'
import axios from 'axios'
import { API_URL } from '../utils/constants'
import { handleResponseApi, formatRut } from '../utils/functions'
import {toast} from 'react-toastify'
import InputFieldRef from '../components/input/InputComponentRef'
import InputField from '../components/input/InputComponent'
import {confirmAlert} from 'react-confirm-alert'
import LoadingComponent from '../components/LoadingComponent'

let categorysColumns = []

const RegisterUser = (props) => {

  const [data,setData] = useState({
    password: "",
    password_repeat: "",
    rut: "",
    role: "VENDEDOR",
  })
  const [validated, setValidated] = useState(false)
  const [isLoading,setIsLoading] = useState(true)
  const inputRef = useRef(null)

  useEffect(() => {
    fetchData()
  },[])

  useEffect(() =>{
    if(inputRef && !isLoading){
      inputRef.current.focus()
    }
  },[inputRef,isLoading])

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
    if(dataPost.password !== dataPost.password_repeat){
      toast.error('Error, sus contraseñas no coinciden')
      return
    }
    let route = API_URL+'users'
    let message = "Perfil Creado con éxito"
    let request = axios.post(route,dataPost)
    setIsLoading(true)
    request.then(result => {
      toast.success(message)
      setTimeout(function () {
        goToDashboard()
      }, 1500);
    }).catch(err => {
      setIsLoading(false)
      toast.error("Este rut ya esta registrado")
    })
  }

 const fetchData = () => {
  let token = localStorage.getItem('tokenApp')
   axios.get(API_URL+"users", { headers: { "x-access-token": token } }).then(result => {
       setIsLoading(false)
       if(result.data.profile){
         let user = JSON.parse(localStorage.getItem('userApp'))
       }
   }).catch(err => {
     setIsLoading(false)
     handleResponseApi(err,props.history)
   })
 }

 const goToDashboard = () => {
    props.history.replace('/')
 }

  return (
    <Row className="justify-content-center">
      <Col sm={10} md={10} lg={10} xl={10} xs={12}>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
          <Form onSubmit={handleSubmit} noValidate validated={validated}>
            <Row>
              <Col>
                <h4>Datos del vendedor de la nueva Tienda</h4>
              </Col>
            </Row>
            <Row>
              <InputField
                type='text'
                label='Rut'
                name='rut'
                required={true}
                messageErrors={[
                  '*Requerido'
                ]}
                cols='col-md-4 col-lg-4 col-sm-4'
                value={data.rut}
                handleChange={onChange}
              />
            </Row>
            <Row>
              <InputFieldRef
                ref={inputRef}
                type='password'
                label='Password'
                name='password'
                required={false}
                messageErrors={[
                  '*Requerido'
                ]}
                cols='col-md-4 col-lg-4 col-sm-4'
                value={data.password}
                handleChange={onChange}
              />
              <InputField
                type='password'
                label='Confirme su Password'
                name='password_repeat'
                required={false}
                messageErrors={[
                  '*Requerido'
                ]}
                cols='col-md-4 col-lg-4 col-sm-4'
                value={data.password_repeat}
                handleChange={onChange}
              />
            </Row>
            <Row className="justify-content-center">
              <Col sm={4} md={4} lg={4} xl={4}>
                <br/>
                <Button variant="primary" block={true} size="sm" type="submit">Registar</Button>
              </Col>
              <Col sm={4} md={4} lg={4} xl={4}>
                <br/>
                <Button variant="danger" block={true} size="sm" type="button" onClick={goToDashboard}>Volver</Button>
              </Col>
            </Row>
          </Form>
        </>
      )}
      </Col>
    </Row>
  )
}

export default RegisterUser;
