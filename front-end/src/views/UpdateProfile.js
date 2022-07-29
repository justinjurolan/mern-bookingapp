import React from 'react';
import Header from '../components/Header';
import { useState, useEffect } from 'react';
import { isAuthenticated } from '../authentication/Authentication';
import { Navigate } from 'react-router-dom';
import { read, update, updateUser } from '../authentication/apiUser';
import './UpdateProfile.css';

const UpdateProfile = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: false,
  });

  const {
    token,
    user: { _id },
  } = isAuthenticated();

  const { name, email, password, error, success } = values;

  const init = (userId) => {
    // console.log(userId);
    read(userId, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: true });
      } else {
        setValues({ ...values, name: data.name, email: data.email });
      }
    });
  };

  useEffect(() => {
    init(_id);
  }, []);

  const handleChange = (name) => (e) => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    update(_id, token, { name, email, password }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        updateUser(data, () => {
          setValues({
            ...values,
            name: name,
            email: email,
            password: password,
            success: true,
          });
        });
      }
    });
  };

  const redirectUser = (success) => {
    if (success) {
      return <Navigate to="/" />;
    }
  };

  const profileUpdate = (name, email, password) => {
    return (
      <form>
        <div className="input-name">
          <label className="input-name-label">Name:</label>
          <input
            type="text"
            onChange={handleChange('name')}
            value={name}
          ></input>
        </div>
        <div className="input-name">
          <label>Email:</label>
          <input
            type="email"
            onChange={handleChange('email')}
            value={email}
          ></input>
        </div>
        <div className="input-name">
          <label>Password:</label>
          <input
            type="password"
            onChange={handleChange('password')}
            value={password}
          ></input>
        </div>

        <button onClick={clickSubmit} className="btn-primary">
          SUBMIT
        </button>
      </form>
    );
  };

  return (
    <div>
      <Header />
      <div className="update-container">
        {profileUpdate(name, email, password)}
        {redirectUser(success)}
      </div>
    </div>
  );
};

export default UpdateProfile;
