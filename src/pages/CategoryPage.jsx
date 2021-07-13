import React, {useState, useEffect, useMemo, useRef} from 'react'
import PropTypes from 'prop-types'
import Table from '../components/Table'
import {Row, Col, Button, Badge, DropdownButton, Dropdown, Form} from 'react-bootstrap'
import axios from 'axios'
import { API_URL } from '../utils/constants'
import { handleResponseApi, formatNumber } from '../utils/functions'
import {toast} from 'react-toastify'
import InputFieldRef from '../components/input/InputComponentRef'
import {confirmAlert} from 'react-confirm-alert'
import LoadingComponent from '../components/LoadingComponent'

let categorysColumns = []

const CategoryPage = (props) => {

  const [categories,setCategories] = useState([])
  const [validated, setValidated] = useState(false)
  const [data, setData] = useState({name: "",id: ""})
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

  useMemo(() => {
    categorysColumns = [
      {
        Header: "Nombre",
        accessor: "name"
      },
      {
        Header: "Acción",
        Cell : props1 => {
          const {original} = props1.cell.row
          return (
            <DropdownButton size="sm" id={'drop'+original.id} title="Seleccione"  block="true">
              <Dropdown.Item onClick={() => modifyRegister(original)}>Modificar</Dropdown.Item>
              <Dropdown.Item onClick={() => deleteRegister(original.id)}>Eliminar</Dropdown.Item>
            </DropdownButton>
          )
        }
      }
    ]
  },[])

  const onChange = e => {
    setData({...data, [e.target.name] : e.target.value })
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
    let route = dataPost.id ? API_URL+'categories/'+dataPost.id : API_URL+'categories'
    let message = dataPost.id ? "Categoria modificada con éxito" : "Categoria creada con éxito"
    let token = localStorage.getItem('tokenApp')
    let request = dataPost.id ? axios.put(route,dataPost, { headers: { "x-access-token": token }}) : axios.post(route,dataPost,  { headers: { "x-access-token": token }})
    delete dataPost.id
    setIsLoading(true)
    request.then(result => {
      toast.success(message)
      cleanData()
      fetchData()
    }).catch(err => {
      setIsLoading(false)
      handleResponseApi(err,props.history)
    })
  }

  const deleteRegister = id => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui-edit'>
            <h1>¿Esta seguro?</h1>
            <p className="font-alert">¿Desea realmente borrar este registro?</p>
            <button className="button-alert"
              onClick={() => {
                confirmDeleteRegister(id);
                onClose();
              }}
            >
              Si, Aceptar
            </button>
            <button className="button-alert" onClick={onClose}>No</button>
          </div>
        );
      }
    });
  }

  const confirmDeleteRegister = id => {
    setIsLoading(true)
    let token = localStorage.getItem('tokenApp')
    axios.delete(API_URL+'categories/'+id, { headers: { "x-access-token": token }}).then(result => {
      toast.success('Registro eliminado con éxito')
      fetchData()
    }).catch(err => {
      handleResponseApi(err,props.history)
      setIsLoading(false)
    })
  }

  const cleanData = () => {
    setData({id : "", name : ""})
  }

 const fetchData = () => {
   axios.get(API_URL+"categories").then(result => {
       setIsLoading(false)
        setCategories(result.data.docs)
   }).catch(err => {
     setIsLoading(false)
     handleResponseApi(err,props.history)
   })
 }

 const modifyRegister = data => {
   setData({...data,name: data.name, id: data.id})
   inputRef.current.focus();
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
                <h3 className="text-center">Categorias</h3>
              </Col>
            </Row>
            <Row>
              <InputFieldRef
                ref={inputRef}
                type='text'
                label='Nombre'
                name='name'
                required={true}
                messageErrors={[
                  '*Requerido'
                ]}
                cols='col-md-8 col-lg-8 col-sm-8'
                value={data.name}
                handleChange={onChange}
                />
              <Col sm={4} md={4} lg={4} xl={4}>
                <br/>
                <Button variant="primary" block={true} size="sm" type="submit">Enviar</Button>
              </Col>
            </Row>
          </Form>
          <br/>
          <Table data={categories} columns={categorysColumns} />
        </>
      )}
      </Col>
    </Row>
  )
}

export default CategoryPage
