import './TourDetails.scss';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import startingIcon from '../components/Images/starting.png';
import endingIcon from '../components/Images/ending.png';
import durationIcon from '../components/Images/duration.png';
import difficultyIcon from '../components/Images/difficulty.png';
import Header from '../components/Header';
import Map from '../components/TourDetail components/Map';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { Calendar } from 'react-date-range';
import { addDays, format } from 'date-fns';
import { isAuthenticated } from '../authentication/Authentication';
import { FaStar } from "react-icons/fa";

const TourDetails = () => {
  const [tour, setTour] = useState(null);
  const [locationsArray, setLocationsArray] = useState();
  const { user } = isAuthenticated();
  // const [tour, setTour] = useState([]);
  // const [tourStartingLocation, setTourStartingLocation] = useState();
  // const [tourEndingLocation, setTourEndingLocation] = useState();
  // const [tourImages, setTourImages] = useState([]);
  // const bgMain = useRef(null);
  // const bg1 = useRef(null);
  // const bg2 = useRef(null);
  // const bg3 = useRef(null);
  // const bg4 = useRef(null);
  // 1 element = 1 reference (useRef)
  const { id } = useParams();
  // const [startDate, setstartDate] = useState(new Date());
  // const [endDate, setendDate] = useState(addDays(new Date(), 4));

  // // derived state
  // const start = tour.length > 0 && tour.locations[0].name;
  // const end = tour.length > 0 && tour.locations;
  // const images = tour.length > 0 && tour.images;
  const [startDate, setstartDate] = useState(new Date());
  const [reviews, setReviews] = useState([]);

  const { locations, duration, images, difficulty, description } = tour || {};

  const endDate = addDays(startDate, +duration - 1);
  // console.log(endDate);
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const {
          data: {
            data: { tour },
          },
        } = await axios.get(`http://localhost:8000/api/v1/tours/${id}`);
        setTour(tour);
        // setTour(response.data.data.tour)
        // const start = response.data.data.tour.locations[0].name;
        // const end = response.data.data.tour.locations;
        // const images = response.data.data.tour.images;
        // setTourStartingLocation(start)
        // setTourEndingLocation(end[end.length - 1].name)
        // setTourImages(images);
        // console.log(images)
        setLocationsArray(tour.locations);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchItems();
  }, [id]);


  // Review useEffect
  useEffect(() => {
    const getData = async () => {
    
        const response = await axios.get('http://localhost:8000/api/v1/reviews');
          setReviews(response.data.data.reviews);
          console.log(response.data.data.reviews);
    }

    getData();
  },[])

  const paymentRequestHandler = async () => {
    try {
      // const tourStartBase = moment().subtract(10, 'days').startOf('day');
      const tourStartBase = moment(startDate).startOf('day');
      const tourStartFormatted = tourStartBase.format();
      const tourEndFormatted = tourStartBase
        .add(tour.duration, 'days')
        .endOf('day')
        .format();

      console.log(tourStartFormatted, tourEndFormatted);

      const response = await axios.post(
        `http://localhost:8000/api/v1/bookings/payments`,
        {
          user,
          tour,
          tourStart: tourStartFormatted,
          tourEnd: tourEndFormatted,
        }
      );

      console.log(response);
      window.location.href = response.data.data.session.url;
    } catch (err) {
      console.log(err);
    }
  };

  // const paymentRequestHandler = async () => {
  //   try {
  //     const response = await axios.post(
  //       `http://localhost:8000/api/v1/bookings/payments`,
  //       { user, tour }
  //     );
  //     window.location.href = response.data.data.session.url;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   setendDate(addDays(startDate, +tour.duration - 1))
  // }, [startDate])

  // useEffect(() => {
  // bgMain.current.style.backgroundImage = `url(${tourImages[0]})`;
  // bgMain.current.style.backgroundSize = "cover";
  // bgMain.current.style.backgroundPosition = "center";
  // bg1.current.style.backgroundImage = `url(${tourImages[1]})`;
  // bg1.current.style.backgroundSize = "cover";
  // bg1.current.style.backgroundPosition = "center";
  // bg2.current.style.backgroundImage = `url(${tourImages[2]})`;
  // bg2.current.style.backgroundSize = "cover";
  // bg2.current.style.backgroundPosition = "center";
  // bg3.current.style.backgroundImage = `url(${tourImages[3]})`;
  // bg3.current.style.backgroundSize = "cover";
  // bg3.current.style.backgroundPosition = "center";
  // bg4.current.style.backgroundImage = `url(${tourImages[4]})`;
  // bg4.current.style.backgroundSize = "cover";
  // bg4.current.style.backgroundPosition = "center";

  // }, [tourImages])

  // tour && console.log(tour);
  if (!tour) {
    return null;
  }

  return (
    <>
      <Header />
      <div className='Details'>
        <h1>{tour.name}</h1>
        <div className='Tour-Details'>
          <div className='Tour-Details__images'>
            {images.map((src) => (
              <div key={src} className='Tour-Details__image'>
                <img src={src} alt='' />
              </div>
            ))}
            {/* <div className="Tour__image" ref={bgMain}></div>
            <div className="Tour__images">
              <div className="bg" ref={bg1}></div>
              <div className="bg" ref={bg2}></div>
              <div className="bg" ref={bg3}></div>
              <div className="bg" ref={bg4}></div>
            </div> */}
          </div>
          <div className='Tour-Details__documentation'>
            <div className='Tour-Details__documentation-info'>
              <div className='Details-information'>
                <h3 className='Details-title'>Details</h3>
                <div className='Details-container'>
                  <div className='Details-container__info'>
                    <img src={startingIcon} alt='starting-point' />
                    <div>
                      <p>Tour starts</p>
                      {locations.length && <p>{locations[0].name}</p>}
                    </div>
                  </div>
                  <div className='Details-container__info'>
                    <img src={endingIcon} alt='starting-point' />
                    <div>
                      <p>Tour ends</p>
                      {locations.length && (
                        <p>{locations[locations.length - 1].name}</p>
                      )}
                    </div>
                  </div>
                  <div className='Details-container__info'>
                    <img src={durationIcon} alt='starting-point' />
                    <div>
                      <p>Duration</p>
                      <p>{duration} days</p>
                    </div>
                  </div>
                  <div className='Details-container__info'>
                    <img src={difficultyIcon} alt='starting-point' />
                    <div>
                      <p>Difficulty</p>
                      <p>{difficulty}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='Details-description'>
                <h3 className='Details-title'>Description</h3>
                <p>{description}</p>
              </div>
            </div>
            <div className='Tour-Details__documentation-date'>
              <div className='calendar'>
                <h3>Select Dates</h3>
                <Calendar
                  onChange={(date) => {
                    setstartDate(date);
                  }}
                  minDate={startDate}
                  editableDateInputs={true}
                  moveRangeOnFirstSelection={false}
                  months={1}
                  className='calendarElement'
                />
              </div>

              <button className='booknow-btn' onClick={paymentRequestHandler}>
                Book Now
              </button>
            </div>
          </div>
        </div>

        <h3 className='Details-title'>Map</h3>
        <div className='map-container'>
          {locationsArray && <Map locations={locationsArray} />}
        </div>
        <div className='Reviews'>
          <h3>Reviews</h3>
         
           

            {
              reviews && reviews.filter((r) => r.tour.id === id ).map((r) => {

                return (
                  <div className='Tour-Review'>
                    <div className='Tour-Review__image'>
                    <img
                      src={r.user.image.path}
                      alt={r.user.name}
                    />
                  </div>

                    <div className='Tour-Review__details'>
                      <p className='Tour-Review__details__name'>{r.user.name}</p>
                      <p className='Tour-Review__details__rating'>

                      {[...Array(5)].map((star, i) => {
                            const ratingValue = i + 1;
                            return (
                              <>
                                <input
                                  type="radio"
                                  name="rating"
                                  value={r.rating}
                                  readOnly
                                />
                                <FaStar
                                  size={25}
                                  className="star"
                                  color={
                                    ratingValue <= r.rating
                                      ? "#ffc107"
                                      : "#e4e5e9"
                                  }
                                />
                              </>
                            );
                          })}

                      </p>
                      <p className='Tour-Review__details__date'>{format(new Date(r.createdAt), "MM/dd/yy")}</p>
                      <p className='Tour-Review__details__comment'>
                        {r.review}
                      </p>
                    </div>
                    </div>
                  
                )
              })

            }
          
        </div>
      </div>
    </>
  );
};

export default TourDetails;
