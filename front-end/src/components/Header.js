import './Header.scss';
import layag from './Images/layag-icon.png';
import profile from './Images/user-menu64.png';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signout, isAuthenticated } from '../authentication/Authentication';

const Header = () => {
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();

  const onclick = () => {
    setModal((modal) => !modal);
  };

  return (
    <>
      <header className="Header">
        <Link to="/">
          <div className="Header__logoTitle">
            <img className="Header__logo" src={layag} alt="logo" />
            <h1>Layag</h1>
          </div>
        </Link>

        <div className="Header__userSection">
          <img src={profile} alt="user-login" onClick={onclick} />
        </div>

        {/* // MODAL */}
        {/* {modal && (
          <div className="Header__modal">
            <ul>
              <li>Profile</li>
              <li>Tour</li>
              <li>Help</li>
            </ul>
          </div>
        )} */}
        {modal && !isAuthenticated() && (
          <div className="Header__modal">
            <ul>
              <Link to="/signup">
                <li>Sign up</li>
              </Link>
              <Link to="/login">
                <li>Log in</li>
              </Link>
              <li>Help</li>
            </ul>
          </div>
        )}
        {modal && isAuthenticated() && isAuthenticated().user.role === 'user' && (
          <div className="Header__modal" style={{height : "120px"}}>
            <ul>
              <Link to="/profile">
                <li>My Profile</li>
              </Link>
              <li
                onClick={() =>
                  signout(() => {
                    navigate('/login', { replace: true });
                  })
                }
              >
                Sign out
              </li>
            </ul>
          </div>
        )}
        {modal && isAuthenticated() && isAuthenticated().user.role === 'admin' && (
          <div className="Header__modal">
            <ul>
              <Link to="/profile">
                <li>My Profile</li>
              </Link>
              <Link to="/tourHistory">
                <li>Modify Tours</li>
              </Link>
              <li
                onClick={() =>
                  signout(() => {
                    navigate('/login', { replace: true });
                  })
                }
              >
                Sign out
              </li>
            </ul>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
