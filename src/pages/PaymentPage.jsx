import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Table from "../components/Table";
import {
  Row,
  Col,
  Button,
  Badge,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../utils/constants";
import { handleResponseApi, formatNumber } from "../utils/functions";
import { toast } from "react-toastify";
import LoadingComponent from "../components/LoadingComponent";
import { confirmAlert } from "react-confirm-alert";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

let paymentColumns = [];

const PaymentPage = (props) => {
  const [payments, setPayment] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useMemo(() => {
    paymentColumns = [
      {
        Header: "Número de Orden",
        accessor: "reference",
      },
      {
        Header: "Método de pago",
        accessor: "method",
      },
      {
        Header: "Total",
        accessor: "total",
        Cell: (props1) => {
          const original = props1.cell.row.original;
          return formatNumber(original.total, 2, ",", ".");
        },
      },
      {
        Header: "Tienda",
        accessor: (props1) => [
          props1.profile_id ? props1.profile_id: "",
        ],
      },
      {
        Header: "Status",
        accessor: (props1) =>
          props1.status === "IN-PROGRESS"
            ? ["Procesando"]
            : props1.status === "SUCCESS"
            ? ["Confirmado"]
            : props1.status === "FAIL"
            ? ["Rechazado"]
            : ["Rejet"],
        Cell: (props1) => {
          const { original } = props1.cell.row;
          return (
            <Badge variant={original.status === "IN-PROGRESS"
            ? "warning"
            : original.status === "SUCCESS"
            ? "success"
            : original.status === "FAIL"
            ? "danger"
            : "Rejet"} className="font_badge">
              {original.status === "IN-PROGRESS"
                ? "Procesando"
                : original.status === "SUCCESS"
                ? "Confirmado"
                : original.status === "FAIL"
                ? "Rechazado"
                : "Rejet"}
            </Badge>
          );
        },
      },
      {
        Header: "Orden de flow",
        accessor: (props1) => [props1.flow_order],
      },
      // {
      //   Header: "Transportista",
      //   accessor: (props1) => [props1.carrier ? props1.carrier.name : ""],
      // },
      {
        Header: "Acción",
        Cell: (props1) => {
          const { original } = props1.cell.row;
          if (original.status === "IN-PROGRESS") {
            return (
              <DropdownButton
                size="sm"
                id={"drop" + original.id}
                title="Seleccione"
                block="true"
              >
                <Dropdown.Item onClick={() => changeStatus(original, "SUCCESS")}>
                  Confirmar
                </Dropdown.Item>
                <Dropdown.Item onClick={() => changeStatus(original, "FAIL")}>
                  Rechazar
                </Dropdown.Item>
              </DropdownButton>
            );
          } else {
            return "";
          }
        },
      },
    ];
  }, []);

  const fetchData = () => {
    let token = localStorage.getItem("tokenApp");
    axios
      .get(API_URL + "orders", {params: {not_paginate: true }, headers: { "x-access-token": token } })
      .then((result) => {
        setIsLoading(false);
        setPayment(result.data);
      })
      .catch((err) => {
        setIsLoading(false);
        handleResponseApi(err,props.history)
      });
  };

  const changeStatus = (data, status) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui-edit">
            <h1>¿Esta seguro?</h1>
            <p className="font-alert">
              ¿Desea realmente cambiar el estado este registro?
            </p>
            <button
              className="button-alert"
              onClick={() => {
                confirmChangeStatus(data, status);
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

  const confirmChangeStatus = (data, status) => {
    setIsLoading(true);
    let token = localStorage.getItem("tokenApp");
    axios
      .put(API_URL + "orders/" + data.id, { status: status },{headers: { "x-access-token": token }} )
      .then((result) => {
        toast.success("Status cambiado correctamente");
        fetchData();
      })
      .catch((err) => {
        setIsLoading(false);
        handleResponseApi(err, props.history);
      });
  };

  return (
    <Row className="justify-content-center">
      <Col sm={11} md={11} lg={11} xl={11} xs={12}>
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <>
            <h3 className="text-center">Pedidos</h3>
            <Table data={payments} columns={paymentColumns} />
            <div className="text-center">
              <ExcelFile element={<button type="button" className="btn btn-primary">Exportar a Excel</button>}>
                <ExcelSheet data={payments} name="Pedidos-Kitchen">
                  <ExcelColumn label="Usuario" value="user_id" />
                  <ExcelColumn label="Perfil" value="profile_id" />
                  <ExcelColumn label="Numero de orden" value="reference" />
                  <ExcelColumn label="Metodo de pago" value="method" />
                  <ExcelColumn label="Total" value="total" />
                  <ExcelColumn label="Status" value="status" />
                </ExcelSheet>
              </ExcelFile>
            </div>
          </>
        )}
      </Col>
    </Row>
  );
};

export default PaymentPage;
