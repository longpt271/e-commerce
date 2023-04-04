import { Button, Modal, Table } from 'react-bootstrap';

function MyModal({ show, onHide, data }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Monthly average
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Month</th>
              <th>Average</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data?.length !== 0 &&
              data.map(item => {
                return (
                  <tr key={Math.random()}>
                    <td className="small">Tháng {item.month}</td>
                    <td className="small">
                      {item.avgRevenue.toLocaleString('vi-VN')} VND
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MyModal;
