import React, { useState,useEffect } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'
import './InputComponent.css'

const InputFieldRef = React.forwardRef( (props,ref) => {

  const classFormGroup = props.cols ? props.cols : "col-md-6 col-sm-6"
  if(props.type !== "select" && props.type !== "textarea"){
    return (
      <Form.Group className={classFormGroup}>
        <Form.Label className="fontBold">{props.label}</Form.Label>
        <Form.Control
          ref={ref}
          id={props.id ? props.id : props.name}
          type={props.type}
          name={props.name}
          onChange={props.handleChange}
          value={props.value}
          placeholder={props.placeholder ? props.placeholder : ''}
          required={props.required}
          readOnly={props.readonly ? props.readonly : false}
          className={props.className ? props.className : ''}
          step={props.step ? props.step : ''}
          onKeyUp={ props.handleKeyUp ? props.handleKeyUp : () => {} }
          className={props.className ? props.className+" form-control-sm" : "form-control-sm"}
          style={props.style ? props.style : {}}
          autoComplete={props.autoComplete ? props.autoComplete : 'xxx'}
          maxLength={props.maxLength ? props.maxLength : ""}
          minLength={props.minLength ? props.minLength : ""}
        />
        <Form.Control.Feedback type="invalid">

            {
              props.messageErrors.map((v,i) => {
                return <span key={i} className="error-input">{v}</span>
              })
            }

        </Form.Control.Feedback>
      </Form.Group>
    )
  }else if(props.type === "select"){
    return(
      <Form.Group className={classFormGroup}>
        <Form.Label className="fontBold">{props.label}</Form.Label>
        <Form.Control
          id={props.id ? props.id : props.name}
          as={props.type}
          name={props.name}
          onChange={props.handleChange}
          value={props.value}
          placeholder={props.placeholder ? props.placeholder : ''}
          readOnly={props.readonly ? props.readonly : false}
          required={props.required}
          multiple={props.multiple ? props.multiple : false}
          ref={ref ? ref : null}
          className={props.className ? props.className+" form-control-sm" : "form-control-sm"}
          style={props.style ? props.style : {}}
          autoComplete={props.autoComplete ? props.autoComplete : 'xxx'}
        >
          {props.children}
        </Form.Control>
        <Form.Control.Feedback type="invalid">

            {
              props.messageErrors.map((v,i) => {
                return <span key={i} className="error-input">{v}</span>
              })
            }

        </Form.Control.Feedback>
      </Form.Group>
    )
  }else if(props.type === "textarea"){
    return(
      <Form.Group className={classFormGroup}>
        <Form.Label className="fontBold">{props.label}</Form.Label>
        <Form.Control
          id={props.id ? props.id : props.name}
          as={props.type}
          name={props.name}
          onChange={props.handleChange}
          value={props.value}
          placeholder={props.placeholder ? props.placeholder : ''}
          required={props.required}
          rows={props.rows ? props.rows : 2}
          readOnly={props.readonly ? props.readonly : false}
          onKeyUp={ props.handleKeyUp ? props.handleKeyUp : () => {} }
          ref={ref ? ref : null}
          className={props.className ? props.className+" form-control-sm" : "form-control-sm"}
          style={props.style ? props.style : {}}
          autoComplete={props.autoComplete ? props.autoComplete : 'xxx'}
          maxLength={props.maxLength ? props.maxLength : ""}
          minLength={props.minLength ? props.minLength : ""}
        />
        <Form.Control.Feedback type="invalid">

            {
              props.messageErrors.map((v,i) => {
                return <span key={i} className="error-input">{v}</span>
              })
            }
          
        </Form.Control.Feedback>
      </Form.Group>
    )
  }

})

InputFieldRef.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  handleKeyUp: PropTypes.func,
  value: PropTypes.any,
  cols: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  errors: PropTypes.array,
  messageErrors: PropTypes.array,
  readonly: PropTypes.bool,
  multiple: PropTypes.bool,
  className: PropTypes.string,
  steps: PropTypes.string,
  autoComplete: PropTypes.bool,
  maxLength: PropTypes.string,
  minLength: PropTypes.string,
}

export default InputFieldRef
