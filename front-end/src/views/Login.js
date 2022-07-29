import layag from '../components/Images/layag-icon.png';
import './Login.scss';
import { Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import {
  signin,
  authenticate,
  isAuthenticated,
} from '../authentication/Authentication';

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    loading: false,
    redirectTo: false,
  });

  const { email, password, loading, error, redirectTo } = values;

  const { user } = isAuthenticated();

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signin({ email, password }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        authenticate(data, () => {
          setValues({
            ...values,
            redirectTo: true,
          });
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

  const showLoading = () =>
    loading && (
      <div className="alert alert-info">
        <h2>Loading...</h2>
      </div>
    );

  const redirectUser = () => {
    if (redirectTo) {
      if (user && user.role === 'admin') {
        return <Navigate to="/" replace={true} />;
      } else {
        return <Navigate to="/" replace={true} />;
      }
    }

    if (isAuthenticated()) {
      return <Navigate to="/" replace={true} />;
    }
  };

  const signUpForm = () => {
    return (
      <form>
        <input
          className="login-information__input"
          type="email"
          placeholder="Enter your email"
          onChange={handleChange('email')}
          value={email}
        />
        <p></p>
        <input
          className="login-information__input"
          type="password"
          placeholder="Enter your password"
          onChange={handleChange('password')}
          value={password}
        />
        <p className="login-information__details">Forgot password?</p>
        <button onClick={clickSubmit} className="login-information__btn">
          Proceed
        </button>
      </form>
    );
  };

  return (
    <div className="login-container">
      <div className="login-information">
        <Link to="/">
          <img className="login-information__logo" src={layag} alt="" />
        </Link>
        <h3>Welcome back</h3>
        <p className="login-information__details">Please enter your details.</p>
        {/* <input
          className="login-information__input"
          type="email"
          placeholder="Enter your email"
        />
        <p></p>
        <input
          className="login-information__input"
          type="password"
          placeholder="Enter your password"
        />
        <p className="login-information__details">Forgot password?</p>
        <button type="button" className="login-information__btn">
          {' '}
          Proceed{' '}
        </button> */}
        {showLoading()}
        {showError()}
        {signUpForm()}
        {redirectUser()}
        <p>
          Don't have an account?{' '}
          <Link to="/signup">
            <span>Sign up</span>
          </Link>
        </p>
        <p className="login-information__copyright">
          All images and information is for educational background purposes only
          © 2022
        </p>
      </div>
      <div className="login-image">
        <div className="image"></div>
      </div>
    </div>
  );
};

export default Login;
