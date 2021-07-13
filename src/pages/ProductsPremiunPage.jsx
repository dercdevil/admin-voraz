import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Table from "../components/Table";
import { Row, Col, Button, Badge } from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../utils/constants";
import { handleResponseApi, formatNumber } from "../utils/functions";
import { toast } from "react-toastify";
import LoadingComponent from "../components/LoadingComponent";

let productsColumns = [];

const ProductsPremiunPage = (props) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useMemo(() => {
    productsColumns = [
      {
        Header: "Nombre",
        accessor: "name",
      },
      {
        Header: "Descripción",
        accessor: "description",
      },
      {
        Header: "Precio",
        accessor: "price",
        Cell: (props1) => {
          const { original } = props1.cell.row;
          return formatNumber(original.price, 2, ",", ".");
        },
      },
      {
        Header: "Tienda",
        accessor: (props1) => [props1.profile?.name_store],
      },
      {
        Header: "Status",
        accessor: (props1) => (props1.is_premium ? ["premium"] : ["normal"]),
        Cell: (props1) => {
          const { original } = props1.cell.row;
          return (
            <Badge variant="warning" className="font_badge">
              {original.is_premium ? "Premium" : "Normal"}
            </Badge>
          );
        },
      },
      {
        Header: "Acción",
        Cell: (props1) => {
          return (
            <Button
              variant="primary"
              block={true}
              size="size"
              onClick={() => changeStatus(props1.cell.row.original)}
            >
              Cambiar Status
            </Button>
          );
        },
      },
    ];
  }, []);

  const fetchData = () => {
    axios
      .get(API_URL + "products", {
        params: {
          not_paginate: true,
        },
      })
      .then((result) => {
        setIsLoading(false);
        setProducts(result.data);
      })
      .catch((err) => {
        setIsLoading(false);
        handleResponseApi(err, props.history);
      });
  };

  const changeStatus = (data) => {
    setIsLoading(true);
    let token = localStorage.getItem("tokenApp");
    axios
      .put(
        API_URL + "admin-update-product/" + data.id,
        { is_premium: !data.is_premium },
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

  return (
    <Row className="justify-content-center">
      <Col sm={11} md={11} lg={11} xl={11} xs={12}>
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <>
            <h3 className="text-center">Productos</h3>
            <Table data={products} columns={productsColumns} />
          </>
        )}
      </Col>
    </Row>
  );
};

export default ProductsPremiunPage;
