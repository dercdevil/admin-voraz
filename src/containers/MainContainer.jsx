import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import LayoutComponent from '../components/LayoutComponent'
import {Redirect} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

const MainContainer = (props) => {

  const [validate,setValidate] = useState(true)

  useEffect(() => {
    let user = localStorage.getItem('userApp')
    let token = localStorage.getItem('tokenApp')
    if(!user || !token){
      setValidate(false)
    }
  },[])

  return (
    <React.Fragment>
      {validate ? (
        <LayoutComponent {...props}>
          <br/><br/>
          {props.children}
          <ToastContainer />
        </LayoutComponent>
      ) : (
        <Redirect to="/" />
      )}
    </React.Fragment>
  )
}

export default MainContainer
