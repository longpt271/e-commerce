import { useRef } from 'react';
import { useDispatch } from 'react-redux';

import { toastActions } from 'store/toast';
import classes from './Contact.module.css';

const Contact = () => {
  const dispatch = useDispatch();

  const emailInputRef = useRef();

  // Hàm submit contact form
  const submitHandler = event => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;

    enteredEmail && console.log(enteredEmail);
    enteredEmail && dispatch(toastActions.SHOW_SUCCESS('Subscribe success!'));
  };

  return (
    <div className={`${classes.contact} container row py-5 px-0 mx-0`}>
      <div className="col-lg-6 col-12 px-0">
        <header>
          <h4
            className="h5 fw-bold text-uppercase mb-1"
            style={{ letterSpacing: '0.1em' }}
          >
            LET'S BE FRIENDS!
          </h4>
          <p className="small text-muted small mb-4 mb-lg-0 ">
            Subscribe to receive update products.
          </p>
        </header>
      </div>

      <div className="col-lg-6 col-12 col-sm-12 align-self-center px-0">
        <form onSubmit={submitHandler} className={classes.form}>
          <input
            type="email"
            placeholder="Enter your email address"
            className="p-3"
            required
            ref={emailInputRef}
          />
          <button>Subscribe</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
