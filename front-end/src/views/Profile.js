import './Profile.scss';
import { AiOutlineStar } from 'react-icons/ai';
import { BsCheck } from 'react-icons/bs';
import Header from '../components/Header';
import { isAuthenticated } from '../authentication/Authentication';
import { Link } from 'react-router-dom';
import Rating from '../components/Profile Component/Rating';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const Profile = () => {
  const {
    user: { _id, name, email },
  } = isAuthenticated();

  const [showModal, setshowModal] = useState(false);
  const [userTour, setuserTour] = useState([]);
  const [userBooking, setuserBooking] = useState([]);
  const today = format(new Date(), 'MM/dd/yy');

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/bookings/my-bookings/${_id}?sort=-createdAt`
      );
      setuserTour(response.data.data.bookings);
      console.log(response.data.data.bookings);
    } catch (err) {
      console.log(err);
    }
  };

  const onChange = () => {
    setshowModal((showModal) => !showModal);
  };

  const onclick = (bookingHistory) => {
    setuserBooking(bookingHistory);
    setshowModal((showModal) => !showModal);
  };

  return (
    <>
      <Header />
      <div className='profile'>
        <div className='profile__section'>
          <img
            src='https://cdn-icons-png.flaticon.com/512/64/64572.png'
            alt='profile default'
          />
          <h4>Edit Photo</h4>

          <div className='profile-details'>
            <div>
              <AiOutlineStar />
              <span>2 reviews</span>
            </div>

            <div>
              <AiOutlineStar />
              <span>Identity Verified</span>
            </div>
          </div>

          <div className='profile-verifcation'>
            <h3>Account confirmed</h3>

            <div>
              <BsCheck />
              <span>Identity</span>
              <br />
            </div>

            <div>
              <BsCheck />
              <span>Email address</span>
              <br />
            </div>

            <div>
              <BsCheck />
              <span>Phone number</span>
              <br />
            </div>
          </div>
        </div>
        <div className='profile__information'>
          <h3>Your Profile</h3>

          <div className='credentials'>
            <p>Name: {name}</p>
            <p>Email: {email}</p>
            <p>Password: *******</p>
            <Link to='/updateprofile'>
              <button style={{ cursor: 'pointer' }}>Update Profile</button>
            </Link>
          </div>

          {/* <div className='your-reviews'>
            <h3>Reviews</h3>
            <div className='Tour-Review'>
              <div className='Tour-Review__image'>
                <img
                  src='https://www.musicmundial.com/en/wp-content/uploads/2022/07/BLACKPINKs-Jennie-saves-a-store-from-bankruptcy-just-by-posting-it-on-Instagram-1140x795.jpg'
                  alt='Jennie'
                />
                <p className='Tour-Review__details__name'>Kathleen Sy</p>
                <p className='Tour-Review__details__rating'></p>
                <p className='Tour-Review__details__date'>23/05/2022</p>
              </div>
              <div className='Tour-Review__details'>
                <p className='Tour-Review__details__comment'>
                  Great activity. Gives you the chance to explore and learn
                  about the lesser-popular but just as beautiful attractions of
                  Coron. I recommend doing this activity along with Coron's
                  famous water attractions to get a full appreciation of the
                  island. Our guide was extremely helpful and very informative.
                  He clearly knew what he was talking about. Definitely
                  recommend.
                </p>
              </div>
            </div>

            <div className='Tour-Review'>
              <div className='Tour-Review__image'>
                <img
                  src='https://www.musicmundial.com/en/wp-content/uploads/2022/07/BLACKPINKs-Jennie-saves-a-store-from-bankruptcy-just-by-posting-it-on-Instagram-1140x795.jpg'
                  alt='Jennie'
                />
                <p className='Tour-Review__details__name'>Kathleen Sy</p>
                <p className='Tour-Review__details__rating'></p>
                <p className='Tour-Review__details__date'>23/05/2022</p>
              </div>
              <div className='Tour-Review__details'>
                <p className='Tour-Review__details__comment'>
                  Great activity. Gives you the chance to explore and learn
                  about the lesser-popular but just as beautiful attractions of
                  Coron. I recommend doing this activity along with Coron's
                  famous water attractions to get a full appreciation of the
                  island. Our guide was extremely helpful and very informative.
                  He clearly knew what he was talking about. Definitely
                  recommend.
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      <div className='Profile-History'>
        <h3>Tours</h3>
        <div className='Profile-History-Content'>
          <table>
            <thead>
              <tr>
                <th> Image</th>
                <th> Tour Name </th>
                <th> Price</th>
                <th> Tour Start </th>
                <th> Tour End</th>
                <th> Actions </th>
              </tr>
            </thead>
            <tbody>
              {userTour &&
                userTour.map((t) => {
                  let startDate = format(new Date(t.tourStart), 'MM/dd/yy');
                  let endDate = format(new Date(t.tourEnd), 'MM/dd/yy');
                  return (
                    <tr>
                      <td>
                        <img src={t.tour.imageCover} alt={t.tour.name} />
                      </td>
                      <td>{t.tour.name}</td>
                      <td>
                        &#8369;{' '}
                        {t.price.toLocaleString('en-us', {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td>{startDate}</td>
                      <td>{endDate}</td>
                      <td>
                        {today > endDate && !t.isReviewed ? (
                          <div className='Profile-History__actions'>
                            <button
                              type='button'
                              onClick={() => {
                                onclick(t);
                              }}
                            >
                              Write a reivew
                            </button>
                          </div>
                        ) : today > endDate && t.isReviewed ? (
                          <p>Review Done</p>
                        ) : (
                          <p>In Progress</p>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className='Rating-modal'>
          <Rating onChange={onChange} userBooking={userBooking} userID={_id} />
        </div>
      )}
    </>
  );
};

export default Profile;
