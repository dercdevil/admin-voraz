import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Table from "../components/Table";
import {
  Row,
  Col,
  Button,
  Badge,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../utils/constants";
import { handleResponseApi } from "../utils/functions";
import { toast } from "react-toastify";
import LoadingComponent from "../components/LoadingComponent";
import ModalComponent from "../components/ModalComponent";

let productsColumns = [];

const DashboardPage = (props) => {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  useMemo(() => {
    productsColumns = [
      {
        Header: "Nombre",
        accessor: (props1) => [
          props1.profile
            ? props1.profile.name_store + " - " + props1.profile.id
            : "",
        ],
      },
      {
        Header: "Dirección",
        accessor: (props1) => [props1.profile ? props1.profile.address : ""],
        Cell: (props1) => {
          const { original } = props1.cell.row;
          return (
            <OverlayTrigger
              placement={"right"}
              overlay={
                <Tooltip id="tooltip-disabled2">
                  {original.user_address.map((v, i) => (
                    <ul className="list-group" key={i}>
                      <li
                        className="list-group-item"
                        style={{
                          backgroundColor: "black",
                          color: "white",
                          borderBottom: "1px solid white",
                        }}
                      >
                        <b>Dirección # {i + 1}: </b> {v.address}
                      </li>
                      <li
                        className="list-group-item"
                        style={{
                          backgroundColor: "black",
                          color: "white",
                          borderBottom: "1px solid white",
                        }}
                      >
                        <b>Ciudad: </b> {v.city}
                      </li>
                      <li
                        className="list-group-item"
                        style={{
                          backgroundColor: "black",
                          color: "white",
                          borderBottom: "1px solid white",
                        }}
                      >
                        <b>Descripción: </b> {v.description}
                      </li>
                      <li
                        className="list-group-item"
                        style={{
                          backgroundColor: "black",
                          color: "white",
                          borderBottom: "1px solid white",
                        }}
                      >
                        <b>Latitud: </b> {v.latitude}
                      </li>
                      <li
                        className="list-group-item"
                        style={{
                          backgroundColor: "black",
                          color: "white",
                          borderBottom: "1px solid white",
                        }}
                      >
                        <b>Longitud: </b> {v.longitude}
                      </li>
                    </ul>
                  ))}
                </Tooltip>
              }
            >
              <Button variant="link" size="sm" block={true} type="button">
                {original.user_address.length
                  ? "Direcciones"
                  : "Sin direcciones"}
              </Button>
            </OverlayTrigger>
          );
        },
      },
      {
        Header: "Nombre Gerente",
        accessor: (props1) => [
          props1.profile
            ? props1.profile.name + "-" + props1.profile.last_name
            : "",
        ],
      },
      {
        Header: "Rut",
        accessor: (props1) => [props1.rut],
        Cell: (props1) => {
          return (
            <Badge variant="warning" className="font_badge">
              {props1.cell.row.original.rut}
            </Badge>
          );
        },
      },
      {
        Header: "Acción",
        Cell: (props1) => {
          return (
            <Col>
              <Button
                variant="primary"
                block={true}
                size="size"
                onClick={() => {
                  setModalShow(true);
                  setData({
                    to: props1.cell.row.original.profile.email,
                    subject: "",
                    title: "",
                    message: "",
                  });
                }}
              >
                Correo
              </Button>
              <Button
                variant="primary"
                block={true}
                size="size"
                onClick={() => changeDesactive(props1.cell.row.original)}
              >
                {" "}
                {props1.cell.row.original.status ? "Desactivar" : "Activar"}
              </Button>
            </Col>
          );
        },
      },
    ];
  }, []);

  const fetchData = () => {
    let token = localStorage.getItem("tokenApp");
    axios
      .get(API_URL + "users-all", {
        params: { role: "VENDEDOR" },
        headers: { "x-access-token": token },
      })
      .then((result) => {
        setIsLoading(false);
        setStores(result.data);
      })
      .catch((err) => {
        setIsLoading(false);
        handleResponseApi(err, props.history);
      });
  };

  const changeDesactive = (data) => {
    setIsLoading(true);
    let token = localStorage.getItem("tokenApp");
    axios
      .put(
        API_URL + "users/" + data.id,
        { status: !data.status },
        { headers: { "x-access-token": token } }
      )
      .then((result) => {
        toast.success("Status cambiado correctamente");
        fetchData();
      })
      .catch((err) => {
        setIsLoading(false);
        handleResponseApi(err, props.history);
      });
  };
  const [email, setData] = useState({
    to: "Email@example.com",
    subject: "",
    title: "",
    message: "",
  });
  const handleChange = (e) => {
    setData({ ...email, [e.target.name]: e.target.value });
  };
  const sendEmail = () => {
    setIsLoading(true);
    let token = localStorage.getItem("tokenApp");
    if (
      email.title.length > 3 &&
      email.subject.length > 3 &&
      email.message.length > 4
    ) {
      axios
        .post(API_URL + "api/send-mail-to", email, {
          headers: { "x-access-token": token },
        })
        .then((result) => {
          setIsLoading(false);
          toast.success("Correo Enviado");
          setModalShow(false);
        })
        .catch((err) => {
          setIsLoading(false);
          setModalShow(false);
          toast.error("Error al intentar enviar el correo");
          handleResponseApi(err, props.history);
        });
    } else {
      setIsLoading(false);
      setModalShow(false);
      toast.error("Asegurate de llanar todos los campos");
    }
  };
  return (
    <Row className="justify-content-center">
      <Col sm={11} md={11} lg={11} xl={11} xs={12}>
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <>
            <h3 className="text-center">Tiendas</h3>
            <Table data={stores} columns={productsColumns} />
          </>
        )}
        <ModalComponent
          show={modalShow}
          data={email}
          handleChange={handleChange}
          sendEmail={sendEmail}
          onHide={() => setModalShow(false)}
        />
      </Col>
    </Row>
  );
};

export default DashboardPage;
