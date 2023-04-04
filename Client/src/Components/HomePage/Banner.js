import React from 'react';
import { Link } from 'react-router-dom';

import classes from './Banner.module.css';
import Image from 'img/Image';

const Banner = () => {
  return (
    <section
      className={`${classes.banner} pb-3 d-flex align-items-center`}
      style={{
        backgroundImage: `url(${Image.banner})`,
      }}
    >
      <div className="container py-5">
        <div className="row px-4 px-lg-5">
          <div className="col-lg-6">
            <p className="text-muted small text-uppercase mb-2">
              New Inspiration 2023
            </p>
            <h2 className="h3 text-uppercase">20% off</h2>
            <h2 className="h3 text-uppercase mb-3">on new season</h2>
            <Link className="btn btn-dark" to="/shop">
              Browse collections
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
