import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom';
import {Redirect} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

const BlankContainer = ({component : Component, layout: Layout,...rest}) => {

  const [validate,setValidate] = useState(true)

  useEffect(() => {
    let user = localStorage.getItem('userApp')
    let token = localStorage.getItem('tokenApp')
    if(user && token){
      setValidate(false)
    }
  },[])

  return (
    <>
      {validate ? (
        <Route
          {...rest}
          render={props => (
            <Component {...props} />
          )}
        />
      ) : (
        <Redirect to="/dashboard" />
      )}
    </>
  )
}

export default BlankContainer
