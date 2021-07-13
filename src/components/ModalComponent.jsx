import React from "react";
import { Row, Col, Button, Modal, Form } from "react-bootstrap";
const CenterModal = (props) => {
  const { data, handleChange, sendEmail} = props;
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Form>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Enviar correo...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Col sm="12" className="mb-2">
              <Form.Control
                name="to"
                readOnly
                defaultValue={data.to}
                onChange={handleChange}
              />
            </Col>
            <Col sm="12" className="mb-2">
              <Form.Label>Asunto</Form.Label>
              <Form.Control
                name="subject"
                value={data.subject}
                onChange={handleChange}
                placeholder="Asunto"
              />
            </Col>
            <Col sm="12" className="mb-2">
              <Form.Label>Titulo</Form.Label>
              <Form.Control
                name="title"
                value={data.title}
                onChange={handleChange}
                placeholder="Titulo"
              />
            </Col>
            <Col sm="12">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control
                name="message"
                value={data.message}
                onChange={handleChange}
                placeholder="Mensaje"
                as="textarea"
                rows={3}
              />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={sendEmail}>
            Enviar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
export default CenterModal;
