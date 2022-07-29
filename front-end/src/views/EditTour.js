import './EditTour.scss';
import { useState, useEffect } from 'react'
import { useParams } from 'react-router';
import axios from 'axios';

const EditTour = () => {

  // const [tourId, setTourId] = useState(null);
  const [tourName, setTourName] = useState('');
  const [tourSummary, setTourSummary] = useState('');
  const [tourDescription, setTourDescription] = useState('');
  const [tourDuration, setTourDuration] = useState(0);
  const [tourPrice, setTourPrice] = useState(0);
  const [tourMaxGroupSize, setTourMaxGroupSize] = useState(0);
  const [tourImage, setTourImage] = useState('');
  const [tourDifficulty, setTourDifficulty] = useState('');
  const { id } = useParams();



  const onClick = () => {

    const addingItems = async () => {
      try {
        let response;
        if (id) {
          response = await axios.put(`http://localhost:8000/api/v1/tours/${id}`, {
            name: tourName, duration: tourDuration, maxGroupSize: tourMaxGroupSize, difficulty: tourDifficulty, price: tourPrice, summary: tourSummary, description: tourDescription, imageCover: tourImage
          });
        } else {
          response = await axios.post('http://localhost:8000/api/v1/tours', {
            name: tourName, duration: tourDuration, maxGroupSize: tourMaxGroupSize, difficulty: tourDifficulty, price: tourPrice, summary: tourSummary, description: tourDescription, imageCover: tourImage, locations: [], startLocation: ''
          });
        }

        console.log(response.data);

      } catch (error) {
        console.log(error.message);
      }

    }

    addingItems();
    console.log(tourName, tourSummary, tourDescription, tourDuration, tourPrice, tourMaxGroupSize, tourImage, tourDifficulty)
  }

  useEffect(() => {
    if (id) {
      const getById = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/v1/tours/${id}`
          );
          console.log(response.data.data.tour);
          if (response.data.data.tour) {
            setTourName(response.data.data.tour.name);
            setTourSummary(response.data.data.tour.summary);
            setTourDescription(response.data.data.tour.description);
            setTourDuration(response.data.data.tour.duration);
            setTourPrice(response.data.data.tour.price);
            setTourImage(response.data.data.tour.imageCover);
            setTourDifficulty(response.data.data.tour.difficulty);
            setTourMaxGroupSize(response.data.data.tour.maxGroupSize);
          }
        } catch (error) {
          console.log(error.message);
        }
      };

      getById();
    }
  }, [id]);



  return (
    <div className="AddEditTours">
      <div className="container" >
        <h3><span>Edit</span> tour</h3>
        <label>Tour name</label>
        <input className="AddEdit-input" value={tourName} type="text" placeholder='Enter tour name' onChange={e => setTourName(e.target.value)} />
        <label>Summary</label>
        <textarea className="AddEdit-description AddEdit-input" value={tourSummary} placeholder='Enter Summary' onChange={e => setTourSummary(e.target.value)} />
        <label>Description</label>
        <textarea className="AddEdit-description AddEdit-input" value={tourDescription} placeholder='Enter Description' onChange={e => setTourDescription(e.target.value)} />
      </div>
      <div className="container">
        <label>Duration</label>
        <input className="duration-price__input" type="text" value={tourDuration} placeholder='Enter Duration' onChange={e => setTourDuration(e.target.value)} />
        <label>Price</label>
        <input className="duration-price__input" type="text" value={tourPrice} placeholder='Enter Price' onChange={e => setTourPrice(e.target.value)} />
        <label>Max group size</label>
        <input className="duration-price__input" type="text" value={tourMaxGroupSize} placeholder='Enter Max group size' onChange={e => setTourMaxGroupSize(e.target.value)} />
        <label>Difficulty</label>
        <input className="duration-price__input" type="text" value={tourDifficulty} placeholder='Enter Difficulty' onChange={e => setTourDifficulty(e.target.value)} />
        <label>Image cover</label>
        <input className="AddEdit-input" type="text" placeholder='Enter Image cover' value={tourImage} onChange={e => setTourImage(e.target.value)} />
        <button type="button" className="AddEdit-btn" onClick={onClick}>Save</button>
      </div>
    </div>
  )
}

export default EditTour;