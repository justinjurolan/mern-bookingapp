import "./TourPackages.scss";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";


const TourPackages = () => {
  const [tours, setTours] = useState([]);
  const [rating, setRating] = useState(null);


  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/tours");
        setTours(response.data.data.tours);
        console.log(response.data.data.tours.ratingsAverage)
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchItems();
  }, []);

  return (
    <>
      <h2 className="Tours-title">Tour Packages</h2>
      <div className="Tours">
        {tours &&
          tours.map((tour) => {
            return (
              <Link to={`/tourdetails/${tour.id}`} key={tour.id}>
                <div className="TourPackages">
                  <div className="TourPackages-img">
                    <img src={tour.imageCover} alt="beach" />
                  </div>
                  <div className="TourPackages-list">
                    <h3>{tour.name}</h3>

                    <div class="stars">
                      {[...Array(5)].map((star, i) => {
                        const ratingValue = i + 1;
                        return (
                          <>
                            <input
                              type="radio"
                              name="rating"
                              value={tour.ratingsAverage}
                              readOnly
                            />
                            <FaStar
                              size={25}
                              className="star"
                              color={
                                ratingValue <= tour.ratingsAverage
                                  ? "#ffc107"
                                  : "#e4e5e9"
                              }
                            />
                          </>
                        );
                      })}

                      <div class="cover"></div>
                      <span className="TourPackages-list__rate">{tour.ratingsAverage}</span>
                      <span className="TourPackages-list__review">
                        ({tour.ratingsQuantity}  <span>reviews</span> )
                      </span>
                    </div>

                    <p className="TourPackages-list__location">
                      {tour.startLocation.description}
                    </p>
                    <br />
                    <h5>Details</h5>
                    <p className="TourPackages-list__description">
                      {`${tour.summary.substring(0, 200)}...`}{" "}
                      <span>see more</span>
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </>
  );
};

export default TourPackages;
