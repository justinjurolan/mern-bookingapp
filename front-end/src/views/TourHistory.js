import './TourHistory.scss';
import { Link } from 'react-router-dom';
import {useState, useEffect} from "react";
import axios from 'axios';
import { set } from 'date-fns';

const TourHistory = () => {
  const [tours, setTours] = useState([]);
  const [message, setMessage] = useState();
  const [modal, setModal] = useState(false);
  

  useEffect(() => {
    const getTours = async () => {
      try {
        const getData = await axios.get(
          `http://localhost:8000/api/v1/tours`
        );     
        setTours(getData.data.data.tours);   

      } catch (err) {
        console.log(err);
      } 
    };
    getTours();
  }, []);

  const deleteHandler = async (id) => {
     await axios.delete(`http://localhost:8000/api/v1/tours/${id}`);
   const updatedData = tours.filter((t) => t.id !== id);
   setTours(updatedData);
   setMessage('Item Successfully Deleted');
   setModal(true);

   setTimeout(() => {
    setMessage('');
    setModal(false);
   }, [3000]);

  }



  return (
    <div className="Tour-History">
      <h3>Tours</h3>
      <Link to="/addTour">
        <button type="button">Add Tour+</button>
      </Link>

      {/* Delete Modal */}
      {
        modal &&
      <div className='Message_Modal'>
       <h4>{message}</h4>
      </div>
      }


      <div className="Tour-History-Content">
        <table>
          <thead>
            <tr>

              <th> Image</th>
              <th> Tour Name </th>
              <th> Address</th>
              <th> Price</th>
              <th> Rating </th>
              <th> Actions </th>

            </tr>
          </thead>
          <tbody>

            {
              tours && tours.map((t) => {

                return(

              <tr>
                  <td><img src={t.imageCover}/></td>
                  <td>{t.name}</td>
                  <td>{t.startLocation.address}</td>
                  <td>Php:{t.price}</td>
                  <td>{t.ratingsAverage}</td>
                  <td>
                    <div className="Tour-History__actions">
                      <td><Link to={`/editTour/${t.id}`}><img className="Tour-History__actions__edit" src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" alt="data1" /></Link></td>
                      <td><img className="Tour-History__actions__delete" onClick={() => {deleteHandler(t.id)}}src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" alt="data2" /></td>
                    </div>
                  </td>
              </tr>
                )
              })

            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TourHistory