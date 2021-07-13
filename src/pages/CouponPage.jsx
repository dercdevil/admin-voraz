import React, { useState, useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import Table from "../components/Table";
import {
  Row,
  Col,
  Button,
  Badge,
  DropdownButton,
  Dropdown,
  Form,
} from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../utils/constants";
import { handleResponseApi, formatNumber } from "../utils/functions";
import { nameStore } from "../utils/nameStore";
import { toast } from "react-toastify";
import InputFieldRef from "../components/input/InputComponentRef";
import InputField from "../components/input/InputComponent";
import { confirmAlert } from "react-confirm-alert";
import LoadingComponent from "../components/LoadingComponent";
import * as moment from "moment-timezone";

let couponColumns = [];

const CouponPage = (props) => {
  const [coupons, setCoupons] = useState([]);
  const [validated, setValidated] = useState(false);
  const [stores, setStores] = useState([]);
  const [data, setData] = useState({
    name: "",
    is_used: true,
    discount: "",
    id: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  //  useEffect(() =>{
  //    if(inputRef && !isLoading){
  //      inputRef.current.focus()
  //    }
  //  },[inputRef,isLoading])

  useMemo(() => {
    couponColumns = [
      {
        Header: "Descuento %",
        accessor: "discount",
      },
      {
        Header: "Name",
        accessor: (props1) => [props1.name ? props1.name : "Desactivado"],
      },
      {
        Header: "Tienda",
        accessor: (props1) => [
          props1 ? (props1.profile ? props1.profile_id : "") : "No posee",
        ],
        Cell: (props1) => {
          const { original } = props1.cell.row;
          const NameStore = nameStore(stores, original.profile_id);
          return (
            <Badge variant="warning" className="font_badge">
              {NameStore || original.profile_id}
            </Badge>
          );
        },
      },
      {
        Header: "Status",
        accessor: (props1) => [props1.is_used ? "Desactivado" : "Activo"],
      },
      {
        Header: "Acción",
        Cell: (props1) => {
          const { original } = props1.cell.row;
          return (
            <DropdownButton
              size="sm"
              id={"drop" + original.id}
              title="Seleccione"
              block="true"
            >
              <Dropdown.Item onClick={() => modifyRegister(original)}>
                Modificar
              </Dropdown.Item>
              <Dropdown.Item onClick={() => deleteRegister(original.id)}>
                Eliminar
              </Dropdown.Item>
            </DropdownButton>
          );
        },
      },
    ];
  }, []);

  const onChange = (e) => {
    let val =
      e.target.name === "is_used"
        ? e.target.value === "true"
          ? true
          : false
        : e.target.value;
    setData({ ...data, [e.target.name]: val });
  };

  const handleSubmit = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    let token = localStorage.getItem("tokenApp");
    let user = localStorage.getItem("userApp");

    let dataPost = Object.assign({}, data);
    let route = dataPost.id
      ? API_URL + "coupons/" + dataPost.id
      : API_URL + "create-coupons-by-admin/" + dataPost.id_store;
    let message = dataPost.id
      ? "Cupon modificado con éxito"
      : "Cupon creado con éxito";
    let request = dataPost.id
      ? axios.put(route, dataPost, { headers: { "x-access-token": token } })
      : axios.post(route, dataPost, { headers: { "x-access-token": token } });
    delete dataPost.id;
    setIsLoading(true);
    request
      .then((result) => {
        toast.success(message);
        cleanData();
        fetchData();
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error("Verifica haber llenado todos los campos");
        handleResponseApi(err, props.history);
      });
  };

  const deleteRegister = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui-edit">
            <h1>¿Esta seguro?</h1>
            <p className="font-alert">¿Desea realmente borrar este registro?</p>
            <button
              className="button-alert"
              onClick={() => {
                confirmDeleteRegister(id);
                onClose();
              }}
            >
              Si, Aceptar
            </button>
            <button className="button-alert" onClick={onClose}>
              No
            </button>
          </div>
        );
      },
    });
  };

  const confirmDeleteRegister = (id) => {
    let token = localStorage.getItem("tokenApp");
    setIsLoading(true);
    axios
      .delete(API_URL + "coupons/" + id, {
        headers: { "x-access-token": token },
      })
      .then((result) => {
        toast.success("Registro eliminado con éxito");
        fetchData();
      })
      .catch((err) => {
        handleResponseApi(err, props.history);
        setIsLoading(false);
      });
  };

  const cleanData = () => {
    setData({ id: "", status: true, id_store: "", discount: "" });
    setValidated(false);
  };

  const fetchData = () => {
    let token = localStorage.getItem("tokenApp");

    let promises = [
      axios.get(API_URL + "coupons", { headers: { "x-access-token": token } }),
      axios.get(API_URL + "users-all", {
        params: { role: "VENDEDOR" },
        headers: { "x-access-token": token },
      }),
    ];
    Promise.all(promises)
      .then((result) => {
        setCoupons(result[0].data.docs);
        console.log(result[0].data.docs);
        setStores(result[1].data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        handleResponseApi(err, props.history);
      });
  };

  const modifyRegister = (data) => {
    setData({
      ...data,
      name: data.name,
      discount: data.discount,
      date_expiration: moment(data.date_expiration).format("YYYY-MM-DD"),
      id: data.id,
    });
  };

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
                  <h3 className="text-center">Cupones</h3>
                </Col>
              </Row>
              <Row>
                <InputFieldRef
                  ref={inputRef}
                  type="text"
                  label="Nombre"
                  name="name"
                  required={true}
                  messageErrors={["*Requerido ", "*6 Caracteres obligatorio"]}
                  cols="col-md-4 col-lg-4 col-sm-4"
                  value={data.name}
                  maxLength={"6"}
                  minLength={"6"}
                  handleChange={onChange}
                />
                <InputField
                  type="number"
                  label="Descuento %"
                  name="discount"
                  required={true}
                  messageErrors={["*Requerido"]}
                  cols="col-md-4 col-lg-4 col-sm-4"
                  value={data.discount}
                  handleChange={onChange}
                />

               <InputField
                  type="select"
                  label="Status"
                  name="is_used"
                  required={true}
                  messageErrors={["*Requerido"]}
                  cols="col-md-4 col-lg-4 col-sm-4"
                  value={data.is_used}
                  handleChange={onChange}
                >
                  <option value={false}>Activo</option>
                  <option value={true}>Desactivado</option>
                </InputField> 
              </Row>
              <Row>
                <InputField
                  type="select"
                  label="Tiendas"
                  name="id_store"
                  required={true}
                  messageErrors={["*Requerido"]}
                  cols="col-md-4 col-lg-4 col-sm-4"
                  value={data.id_store}
                  handleChange={onChange}
                >
                  <option value="">--Seleccione--</option>
                  {stores.map((v, i) => (
                    <option value={v.id} key={i}>
                      {v.profile ? v.profile.name_store : ""}
                    </option>
                  ))}
                </InputField>
              </Row>
              <Row className="justify-content-center">
                <Col sm={4} md={4} lg={4} xl={4}>
                  <br />
                  <Button
                    variant="primary"
                    block={true}
                    size="sm"
                    type="submit"
                  >
                    Enviar
                  </Button>
                </Col>
              </Row>
            </Form>
            <br />
            <Table data={coupons} columns={couponColumns} />
          </>
        )}
      </Col>
    </Row>
  );
};

export default CouponPage;
