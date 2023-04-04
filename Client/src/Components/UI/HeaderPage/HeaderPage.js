import { useLocation } from 'react-router-dom';

const HeaderPage = ({ title }) => {
  const location = useLocation();
  const isCheckout = location.pathname === '/checkout';

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
          <div className="col-lg-6 d-none d-lg-block">
            <h1
              className="h2 fw-bold text-uppercase mb-0"
              style={{ letterSpacing: '0.1em' }}
            >
              {title}
            </h1>
          </div>
          <div className="col-lg-6 text-lg-right">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                <li
                  className="breadcrumb-item active fw-bold text-uppercase"
                  aria-current="page"
                >
                  {isCheckout && (
                    <span className="text-dark">HOME / CART / </span>
                  )}
                  {title}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeaderPage;
