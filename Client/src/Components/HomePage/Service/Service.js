import classes from './Service.module.css';

const Service = () => {
  return (
    <div className={`${classes.service} container mx-0 row bg-light p-5`}>
      <div className="col-lg-4 col-md-6 col-12 mb-4 mb-lg-0">
        <div className="media-body text-left ml-3">
          <h6 className="fw-bold text-uppercase mb-1">Free shipping</h6>
          <p className="text-small mb-0 text-muted">Free shipping worlwide</p>
        </div>
      </div>

      <div className="col-lg-4 col-md-6 col-12 mb-4 mb-md-0">
        <div className="media-body text-left ml-3">
          <h6 className="fw-bold text-uppercase mb-1">24 X 7 SERVICE</h6>
          <p className="text-small mb-0 text-muted">Free shipping worlwide</p>
        </div>
      </div>

      <div className="col-lg-4 col-12">
        <div className="media-body text-left ml-3">
          <h6 className="fw-bold text-uppercase mb-1">FESTIVAL OFFER</h6>
          <p className="text-small mb-0 text-muted">Free shipping worlwide</p>
        </div>
      </div>
    </div>
  );
};

export default Service;
