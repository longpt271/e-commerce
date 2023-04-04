import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

const ProductModal = ({ show, onHide, product }) => {
  const navigate = useNavigate();
  return (
    <>
      {Object.keys(product).length !== 0 && (
        <Modal
          show={show}
          onHide={onHide}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              <h3 className="h5 fw-bold">{product.name}</h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-lg-6 col-md-12">
                <img
                  className="w-100"
                  src={product.img1}
                  alt={product.category}
                />
              </div>
              <div className="col-lg-6 col-md-12">
                <div className="p-2">
                  <p className="text-muted fw-bold mb-1">
                    {product.price.toLocaleString('vi-VN')} VND
                  </p>
                  <span className="small">{product.short_desc}</span>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="dark"
              onClick={() => navigate('/detail/' + product._id)}
            >
              <FontAwesomeIcon icon={faCartShopping} className="fs-6 me-2" />
              View detail
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default ProductModal;
