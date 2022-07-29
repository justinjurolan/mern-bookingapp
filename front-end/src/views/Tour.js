import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import './Tours.scss';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const Tour = () => {
  const [tours, setTours] = useState([]);
  const [results, setResult] = useState([]);
  const { id } = useParams();
  const [select, setSelect] = useState('rating-highest');
  const [currentLocation, setcurrentLocation] = useState();

  useEffect(() => {
    (async () => {
      const {
        coords: { latitude: lat, longitude: lng },
      } = await getMyCoords();
      setcurrentLocation({ lat, lng });
    })();
  }, []);

  const getMyCoords = async () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const selectSortHandler = (e) => {
    if (e.target.value.startsWith('distance') && !currentLocation) return;

    setSelect(e.target.value);
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km   return d;  // distance returned

    return d; // distance returned
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const sortBy = (arr, select) => {
    let arrCopy = [...arr];
    if (select && select.startsWith('distance')) {
      arrCopy.forEach((el) => {
        el.distance = getDistanceFromLatLonInKm(
          currentLocation.lat,
          currentLocation.lng,
          el.startLocation.coordinates[1],
          el.startLocation.coordinates[0]
        );
      });
    }
    if (select === 'distance-closest' && currentLocation) {
      return arrCopy.sort((a, b) => a.distance - b.distance);
    }
    if (select === 'distance-farthest' && currentLocation) {
      return arrCopy.sort((a, b) => b.distance - a.distance);
    }
    if (select === 'price-lowest') {
      return arr.sort((a, b) => a.price - b.price);
    }
    if (select === 'price-highest') {
      return arr.sort((a, b) => b.price - a.price);
    }
    if (select === 'duration-shortest') {
      return arr.sort((a, b) => a.duration - b.duration);
    }
    if (select === 'duration-longest') {
      return arr.sort((a, b) => b.duration - a.duration);
    }
    if (select === 'rating-highest') {
      return arr.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
    }
    if (select === 'rating-lowest') {
      return arr.sort((a, b) => a.ratingsAverage - b.ratingsAverage);
    }
    return arr;
  };

  useEffect(() => {
    const getTours = async () => {
      try {
        const getData = await axios.get(
          `http://localhost:8000/api/v1/tours/destination/${id.toLowerCase()}?sort=ratingsAverage`
        );

        const imageCovers = getData.data.data.tours.map((el) => el.imageCover);

        setTours(getData.data.data.tours);
        setResult(getData.data);
      } catch (err) {
        console.log(err);
      }
    };

    getTours();
  }, [id]);

  return (
    <>
      <Header />
      <div className="Tour">
        <div className="Tour__hero">
          <div className="Tour__Title">
            <h3>
              {results.results} Tours Found In{' '}
              <span>{id[0].toUpperCase() + id.substring(1)}</span>
            </h3>
          </div>
          <div className="filter-section">
            <select
              name="filter"
              id="filter"
              onChange={selectSortHandler}
              value={select}
            >
              <option value="distance-closest">Distance: Closest</option>
              <option value="distance-farthest">Distance: Farthest</option>
              <option value="price-lowest">Price: Lowest to Highest</option>
              <option value="price-highest">Price: Highest to Lowest</option>
              <option value="duration-shortest">Duration: Shortest</option>
              <option value="duration-longest">Duration: Longest</option>
              <option value="rating-highest">Rating: Highest</option>
              <option value="rating-lowest">Rating: Lowest</option>
            </select>
          </div>
        </div>

        <div className="Tour__information">
          <div className="details-section">
            {tours &&
              sortBy(tours, select).map((t, i) => {
                return (
                  <Link to={`/tourdetails/${t.id}`} key={i}>
                    <div className="details-section__choices" key={t.id}>
                      <div className="image">
                        <img src={t.images[0]} alt={t.name} />
                      </div>
                      <div className="details">
                        <h3>{t.name}</h3>

                        <div className="stars">
                          {[...Array(5)].map((star, i) => {
                            const ratingValue = i + 1;
                            return (
                              <div key={i}>
                                <input
                                  type="radio"
                                  name="rating"
                                  value={t.ratingsAverage}
                                  readOnly
                                />
                                <FaStar
                                  size={25}
                                  className="star"
                                  color={
                                    ratingValue <= t.ratingsAverage
                                      ? '#ffc107'
                                      : '#e4e5e9'
                                  }
                                />
                              </div>
                            );
                          })}

                          <span className="TourPackages-list__rate">
                            {' '}
                            {t.ratingsAverage}
                          </span>
                          <span className="TourPackages-list__review">
                            ( {t.ratingsQuantity} reviews )
                          </span>
                        </div>
                        <h4>Details</h4>

                        <p>{t.summary}</p>

                        <h4 className="price">Price:{t.price}</h4>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Tour;
