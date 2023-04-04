import React from 'react';
import { Link } from 'react-router-dom';
import classes from './Footer.module.css';

// Tạo footer by bootstrap 5
const Footer = () => (
  <footer className={`${classes.footer} w-100 flex-shrink-0`}>
    <div className="container py-4">
      <div className="row gy-4">
        <div className="col-lg-4 col-md-6 col-12">
          <h6 className="text-white fw-bold text-uppercase mb-3">
            CUSTOMER SERVICES
          </h6>
          <ul className="list-unstyled text-muted">
            <li>
              <Link to="#">Help &amp; Contact Us</Link>
            </li>
            <li>
              <Link to="#">Returns &amp; Refunds</Link>
            </li>
            <li>
              <Link to="#">Online Stores</Link>
            </li>
            <li>
              <Link to="#">Terms &amp; Conditions</Link>
            </li>
          </ul>
        </div>
        <div className="col-lg-4 col-md-6 col-12">
          <h6 className="text-white fw-bold text-uppercase mb-3">COMPANY</h6>
          <ul className="list-unstyled text-muted">
            <li>
              <Link to="#">What We Do</Link>
            </li>
            <li>
              <Link to="#">Available Services</Link>
            </li>
            <li>
              <Link to="#">Latest Posts</Link>
            </li>
            <li>
              <Link to="#">FAQs</Link>
            </li>
          </ul>
        </div>
        <div className="col-lg-4 col-md-6 col-12">
          <h6 className="text-white fw-bold text-uppercase mb-3">
            SOCIAL MEDIA
          </h6>
          <ul className="list-unstyled text-muted">
            <li>
              <Link to="#">Twitter</Link>
            </li>
            <li>
              <Link to="#">Instagram</Link>
            </li>
            <li>
              <Link to="#">Facebook</Link>
            </li>
            <li>
              <Link to="#">Linkedin</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
