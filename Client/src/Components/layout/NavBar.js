import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faStore,
  faCartFlatbed,
  faUser,
  faFileInvoice,
} from '@fortawesome/free-solid-svg-icons';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

import classes from './NavBar.module.css';
import { authActions } from 'store/auth';
import { toastActions } from 'store/toast';
import { chatAppActions } from 'store/chatApp';

const NavBar = () => {
  const dispatch = useDispatch(); // để cập nhật state redux
  const navigate = useNavigate(); // để chuyển hướng trong ứng dụng.
  const location = useLocation(); // để lấy ra vị trí path hiện tại

  // state lưu trạng thái đóng mở navbar
  const [navExpanded, setNavExpanded] = useState(false);

  // Lấy state redux
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const fullName = useSelector(state => state.auth.fullName);

  // Tạo button nav active css
  const buttonNav = (path, name, originName) => {
    const isActivePath = location.pathname === path ? classes.active : '';

    const navItem = name ? (
      <button className={`${isActivePath} fw-bold text-capitalize`}>
        {name}
      </button>
    ) : (
      <button className={`${isActivePath} fw-bold`}>{originName}</button>
    );

    return navItem;
  };

  const navDropdownTitle = isAuthenticated && (
    <span>
      <FontAwesomeIcon icon={faUser} className={classes.navIcon} />
      {buttonNav('/profile', false, fullName)}
    </span>
  );

  return (
    <Navbar
      className={`${classes.NavMain} py-3`}
      // onToggle={() => setNavExpanded(navExpanded ? false : 'expanded')}
      expanded={navExpanded}
      expand="lg"
    >
      <Container>
        <Navbar.Brand className={classes.abs}>
          <Link className="fw-bold text-uppercase text-dark" to="/">
            BOUTIQUE
          </Link>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => setNavExpanded(navExpanded ? false : 'expanded')}
        />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              onClick={() => {
                setNavExpanded(false); // close navbar in mobile view
                navigate('/');
              }}
            >
              <FontAwesomeIcon
                icon={faHouse}
                className={`${classes.navIcon} d-lg-none`}
              />
              {buttonNav('/', 'home')}
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                setNavExpanded(false); // close navbar in mobile view
                navigate('/shop');
              }}
            >
              <FontAwesomeIcon
                icon={faStore}
                className={`${classes.navIcon} d-lg-none`}
              />
              {buttonNav('/shop', 'shop')}
            </Nav.Link>
          </Nav>

          {!isAuthenticated && (
            <Nav>
              <Nav.Link
                onClick={() => {
                  setNavExpanded(false); // close navbar in mobile view
                  navigate('/login');
                }}
              >
                <FontAwesomeIcon icon={faUser} className={classes.navIcon} />
                {buttonNav('/login', 'login')}
              </Nav.Link>
            </Nav>
          )}

          {isAuthenticated && (
            <Nav>
              <Nav.Link
                onClick={() => {
                  setNavExpanded(false); // close navbar in mobile view
                  navigate('/cart');
                }}
              >
                <FontAwesomeIcon
                  icon={faCartFlatbed}
                  className={classes.navIcon}
                />
                {buttonNav('/cart', 'cart')}
              </Nav.Link>

              <Nav.Link
                className="d-block d-lg-none"
                onClick={() => {
                  setNavExpanded(false); // close navbar in mobile view
                  navigate('/order');
                }}
              >
                <FontAwesomeIcon
                  icon={faFileInvoice}
                  className={classes.navIcon}
                />
                {buttonNav('/order', 'order')}
              </Nav.Link>

              <NavDropdown
                title={navDropdownTitle}
                align="end"
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item
                  onClick={() => {
                    setNavExpanded(false); // close navbar in mobile view
                    navigate('/profile');
                  }}
                >
                  <span className="fw-bold">Info</span>
                </NavDropdown.Item>
                <NavDropdown.Item
                  className="d-none d-lg-block"
                  onClick={() => {
                    setNavExpanded(false); // close navbar in mobile view
                    navigate('/order');
                  }}
                >
                  <span className="fw-bold">Order</span>
                </NavDropdown.Item>

                <NavDropdown.Divider />

                <NavDropdown.Item
                  onClick={() => {
                    setNavExpanded(false); // close navbar in mobile view

                    // cập nhật redux state
                    dispatch(authActions.ON_LOGOUT());
                    dispatch(chatAppActions.REMOVE_ROOM());

                    // thông báo điều hướng
                    dispatch(toastActions.SHOW_SUCCESS('Logout success!'));
                    navigate('/login');
                  }}
                >
                  <span className="fw-bold">(Logout)</span>
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
