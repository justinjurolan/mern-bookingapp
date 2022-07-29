import './SignUp.scss';
import { Link } from 'react-router-dom';
import layag from '../components/Images/layag-icon.png';
import { signup } from '../authentication/Authentication';
import { useState } from 'react';

const SignUp = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: false,
  });

  const { name, email, password, success, error } = values;

  const handleChange = (name) => (event) => {
    setValues({
      ...values,
      error: false,
      [name]: event.target.value,
      success: false,
    });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false });
    signup({ name, email, password }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, success: false });
      } else {
        setValues({
          ...values,
          name: '',
          email: '',
          password: '',
          error: '',
          success: true,
        });
      }
    });
  };

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? '' : 'none' }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-info"
      style={{ display: success ? '' : 'none' }}
    >
      New Account is created. Please <Link to="/login">Signin</Link>
    </div>
  );

  const signUpForm = () => {
    return (
      <form>
        <input
          onChange={handleChange('name')}
          className="signUp-information__input"
          type="text"
          placeholder="Enter your name"
          value={name}
        />
        <p></p>
        <input
          className="signUp-information__input"
          type="email"
          placeholder="Enter your email"
          onChange={handleChange('email')}
          value={email}
        />
        <p></p>
        <input
          className="signUp-information__input"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={handleChange('password')}
        />
        <p className="signUp-information__details">
          Must be at least<span> 8 characters</span>
        </p>
        {/* <input
          className="signUp-information__input"
          type="password"
          placeholder="Confirm your password"
          value={password}
          onChange={handleChange('password')}
        /> */}
        <p></p>
        <button onClick={clickSubmit} className="signUp-information__btn">
          Register
        </button>
      </form>
    );
  };

  return (
    <div className="signUp-container">
      <Link to="/login">
        <img
          className="signUp-arrow"
          src="https://cdn-icons-png.flaticon.com/512/507/507257.png"
          alt="back-arrow"
        />
      </Link>
      <div className="signUp-image">
        <div className="image"></div>
      </div>
      <div className="signUp-information">
        <Link to="/">
          <img className="signUp-information__logo" src={layag} alt="" />
        </Link>
        <h3>Create an account</h3>
        <p className="signUp-information__details">
          Please enter your details.
        </p>
        {/* <input
          className="signUp-information__input"
          type="text"
          placeholder="Enter your name"
        />
        <p></p>
        <input
          className="signUp-information__input"
          type="email"
          placeholder="Enter your email"
        />
        <p></p>
        <input
          className="signUp-information__input"
          type="password"
          placeholder="Enter your password"
        />
        <p className="signUp-information__details">
          Must be at least<span> 8 characters</span>
        </p>
        <input
          className="signUp-information__input"
          type="password"
          placeholder="Confirm your password"
        />
        <p></p>
        <button type="button" className="signUp-information__btn">
          {' '}
          Register{' '}
        </button> */}
        {showSuccess()}
        {showError()}
        {signUpForm()}
      </div>
      <p className="signUp-information__copyright">
        All images and information is for educational background purposes only ©
        2022
      </p>
    </div>
  );
};

export default SignUp;
