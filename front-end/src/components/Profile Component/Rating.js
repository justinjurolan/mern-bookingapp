import React from "react";
import { FaStar } from "react-icons/fa";
import { useState } from "react";
import "./Rating.scss";
import axios from"axios";

const Rating = ({onChange, userBooking, userID}) => {
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState();
  const [hover, setHover] = useState(null);
  const [tourDetails, setTourDetails]= useState(userBooking);

  const onclick = () => {
    onChange();
  }

  const onchange = () => {
    let addData = {
      review: review,
      rating: rating,
      tour: tourDetails.tour._id,
      user: userID,
      booking: tourDetails._id
    }
    if(rating && review){
    axios.post("http://localhost:8000/api/v1/reviews", addData).then((response) => {
      return axios.patch(`http://localhost:8000/api/v1/bookings/${tourDetails._id}`, {isReviewed : true})
    }).then((response) => {
      console.log(response);
    })
    
    setReview('');  
    onChange();
    }else{

    }
  }

  return (
    <div className="Rating">
      <div>
        <img src="https://cdn-icons-png.flaticon.com/512/7644/7644639.png" onClick={onclick} alt="close button" />
        <h3>Give us a feedback!</h3>
      </div>
      <div className="Rating__details">

        <div className="Rating__details-name">
          <label>Tour Name</label>
          <input type="text" value={tourDetails.tour.name} readOnly />
        </div>

        <label className="Rating__details-rate">Rate</label>
        <div className="Rating__details-rating">

          {[...Array(5)].map((star, i) => {
            const ratingValue = i + 1;
            return (
              <>
                <label>
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => setRating(ratingValue)}
                />
                <FaStar
                  size={50}
                  className="star"
                  color={ratingValue <= (hover || rating) ? "#ffc107" : "#d2cedf"}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                />
                </label>
              </>
            );
          })}
        </div>

        <div className="Rating__details-comment">
          <textarea placeholder="Leave a comment..." value={review} onChange={e => setReview(e.target.value)}/>
        </div>
        <button type="button" className="Rating__details-btn" onClick={() => onchange()}>Rate now</button>
      </div>
      <h3 >Thank you!</h3>
    </div>
  );
};

export default Rating;
