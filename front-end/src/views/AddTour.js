import './AddTour.scss';
import { useEffect, useState } from 'react'
import axios from 'axios';
import removeIcon from '../components/Images/remove-icon.png'


const AddEditTours = () => {

  const [modal, setModal] = useState(false)
  const [spinner, setSpinner] = useState(false)

  // Details
  const [tourName, setTourName] = useState('');
  const [tourSummary, setTourSummary] = useState('');
  const [tourDescription, setTourDescription] = useState('');
  const [tourDuration, setTourDuration] = useState(0);
  const [tourPrice, setTourPrice] = useState(0);
  const [tourMaxGroupSize, setTourMaxGroupSize] = useState(0);
  const [tourDifficulty, setTourDifficulty] = useState('');

  // Tour Guide

  const [tourGuide, setTourGuide] = useState('')
  const [arrTourGuide, setArrTourGuide] = useState([])

  // Locations
  const [locationName, setLocationName] = useState('')
  const [startLocation, setStartLocation] = useState({})
  const [locations, setLocations] = useState([]);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [address, setAddress] = useState('');
  const [locDescription, setLocDescription] = useState('');
  const [day, setDay] = useState(0);

  // Tags
  const [tags, setTags] = useState('')
  const [arrTags, setArrTags] = useState([])

  // Image Cover
  const [previewImageCover, setPreviewImageCover] = useState([]);
  const [imageCoverToUpload, setImageCoverToUpload] = useState([]);

  // Images 
  const [previewImage, setPreviewImage] = useState([]);
  const [imageToUpload, setImageToUpload] = useState([]);

  // Modal
  const [hidden, setHidden] = useState('');


  // const { id } = useParams();

  const fileInputHandler = (e) => {
    const file = e.target.files;
    setImageCoverToUpload((prevImages) => [...prevImages, ...file]);
    previewFile(file);
  };

  const fileInput_Handler = (e) => {
    const file = e.target.files;
    setImageToUpload((prevImages) => [...prevImages, ...file]);
    preview_File(file);
  };

  const previewFile = async (file) => {
    for (let i = 0; i < file.length; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(file[i]);
      reader.onloadend = () => {
        const imageToSave = { file: file[i], img: reader.result };
        setPreviewImageCover((prevImages) => [...prevImages, imageToSave]);
      };
    }
  };

  const preview_File = async (file) => {
    for (let i = 0; i < file.length; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(file[i]);
      reader.onloadend = () => {
        const imageToSave = { file: file[i], img: reader.result };
        setPreviewImage((prevImages) => [...prevImages, imageToSave]);
      };
    }
  };

  const removeImage = (name, i) => {
    setPreviewImageCover((previewImage) =>
      previewImage.filter(
        (img, currentIndex) => img.file.name !== name || currentIndex !== i
      )
    );

    setImageCoverToUpload((previewImage) =>
      previewImage.filter(
        (img, currentIndex) => img.name !== name || currentIndex !== i
      )
    );
  };

  const remove_Image = (name, i) => {
    setPreviewImage((previewImage) =>
      previewImage.filter(
        (img, currentIndex) => img.file.name !== name || currentIndex !== i
      )
    );

    setImageToUpload((previewImage) =>
      previewImage.filter(
        (img, currentIndex) => img.name !== name || currentIndex !== i
      )
    );
  };

  const resetFieldsAndValue = () => {
    setImageCoverToUpload([]);
    setPreviewImageCover([]);
  };

  const reset_FieldsAndValue = () => {
    setImageToUpload([]);
    setPreviewImage([]);
  };

  const resetState = () => {
    setTourName('')
    setTourSummary('')
    setTourDescription('')
    setTourDuration(0)
    setTourPrice(0)
    setTourMaxGroupSize(0)
    setTourDifficulty('')

    setArrTourGuide([])
    setStartLocation({})
    setLocations([])
    setArrTags([])
    resetFieldsAndValue()
    reset_FieldsAndValue()
  }

  const addStartLocation = () => {
    let data = {
      coordinates: [latitude, longitude],
      address,
      description: locDescription
    }
    setStartLocation(data)
    setLatitude(0)
    setLongitude(0)
    setAddress('')
    setLocDescription('')


  }
  const addLocation = () => {
    let data = {
      coordinates: [latitude, longitude],
      address,
      description: locDescription,
      day,
      name: locationName
    }
    locations.push(data)
    setLatitude(0)
    setLongitude(0)
    setAddress('')
    setLocDescription('')
    setDay()
    setLocationName('')


  }
  const addTags = () => {
    arrTags.push(tags)
    setTags('')

  }
  const addTourGuide = () => {
    arrTourGuide.push(tourGuide)
    setTourGuide('')
  }




  const addTourFunction = () => {

    const fetchingItems = async () => {

      try {

        const response = await axios.post('http://localhost:8000/api/v1/tours', {
          name: tourName, duration: tourDuration, maxGroupSize: tourMaxGroupSize, difficulty: tourDifficulty, price: tourPrice, summary: tourSummary, description: tourDescription, imageCover: previewImageCover[0], locations, startLocation, images: previewImage, tags, guides: arrTourGuide
        });
        console.log(response.data);
      } catch (error) {
        console.log(error.message);
      }

    }

    fetchingItems();
    resetState();
    setSpinner(spinner => !spinner)
    setModal(modal => !modal)


  }

  useEffect(() => {

    if (modal == true) {
      setSpinner(false)
      setTimeout(() => {
        setModal(false)
      }, 3000);
    }
  }, [modal])







  return (
    <>
      <div className="AddTours">
        <div className="AddTours-container">
          <div className="Add-details container ">
            <label>Tour Name</label>
            <input className="input-medium" type="text" placeholder='Name' value={tourName} onChange={e => setTourName(e.target.value)} />
            <div className="Add-details__inputs">
              <div>
                <label>Difficulty</label>
                <input type="text" placeholder='(e.g easy,medium,hard)' value={tourDifficulty} onChange={e => setTourDifficulty(e.target.value)} />
              </div>
              <div>
                <label>Duration</label>
                <input type="number" placeholder='(e.g 5)' value={tourDuration} onChange={e => setTourDuration(e.target.value)} />
              </div>
              <div>
                <label>Max group size</label>
                <input type="number" placeholder='(e.g 10)' value={tourMaxGroupSize} onChange={e => setTourMaxGroupSize(e.target.value)} />
              </div>
              <div>
                <label>Price</label>
                <input type="number" placeholder='(e.g 8000)' value={tourPrice} onChange={e => setTourPrice(e.target.value)} />

              </div>
            </div>
            <div className="Add-details__textarea">
              <div>
                <label>Summary</label>
                <textarea placeholder='Summary' value={tourSummary} onChange={e => setTourSummary(e.target.value)}></textarea></div>
              <div>
                <label>Description</label>
                <textarea placeholder='Description' value={tourDescription} onChange={e => setTourDescription(e.target.value)}></textarea></div>
            </div>
          </div>
          <div className="Add-images container">
            <div className="Add-images__input">
              <input
                className='image-input-element'
                type='file'
                accept='image/*'
                onChange={fileInput_Handler}
                multiple
              />
            </div>
            <div className="Add-images__display">
              {previewImage.length > 0 ?
                previewImage.map((file, i) => {
                  const {
                    file: { name },
                    img,
                  } = file;
                  const keyAlt = `${name}_${i}`;

                  return (
                    <li key={keyAlt} className='image-list'>
                      <img
                        src={img}
                        className='per-image'
                        alt={keyAlt}
                      />
                      <button
                        type='button'
                        className='remove-image__btn'
                        onClick={() => {
                          remove_Image(name, i);
                        }}
                      >
                        <img className="remove-image__btn" src={removeIcon} alt="remove-icon" />
                      </button>
                    </li>
                  );
                }) : ' Images'}
            </div>
            <div className="Add-images__btns">
              <div className="Add-image-imageCover">
                <div className="Add-image-imageCover">
                  <input
                    className='image-input-element'
                    type='file'
                    accept='image/*'
                    onChange={fileInputHandler}
                    multiple
                  />
                </div>
                <div className="Add-imagecover-display">
                  {previewImageCover.length > 0 ?
                    previewImageCover.map((file, i) => {
                      const {
                        file: { name },
                        img,
                      } = file;
                      const keyAlt = `${name}_${i}`;

                      return (
                        <li key={keyAlt} className='image-container'>
                          <img
                            src={img}
                            className='input-image'
                            alt={keyAlt}
                          />
                          <button
                            type='button'
                            className='remove-image__btn'
                            onClick={() => {
                              removeImage(name, i);
                            }}
                          >
                            <img className="remove-image__btn" src={removeIcon} alt="remove-icon" />
                          </button>
                        </li>
                      );
                    }) : 'Image Cover'}
                </div>
              </div>
              <div className="Add-images-btns">
                <button onClick={e => setHidden('startLocation')}>Start Location +</button>
                <button onClick={e => setHidden('location')}>Locations +</button>
                <button onClick={e => setHidden('tags')}>Tags +</button>
                <button onClick={e => setHidden('tourGuide')}>Tour guide +</button>
              </div>
            </div>
          </div>
        </div>
        <button className="AddEdit-btnSave" onClick={addTourFunction}> Save </button>
      </div>

      {
        hidden === 'startLocation' &&
        <div className="AddModal">
          <div className="AddModal-startLocation">
            <h3>Starting location +</h3>
            <div>
              <div>
                <label>Latitude</label>
                <input type="number" placeholder='(e.g 121.00000)' value={latitude} onChange={e => setLatitude(e.target.value)} />
                <label>Longitude</label>
                <input type="text" placeholder='(e.g 12.00000)' value={longitude} onChange={e => setLongitude(e.target.value)} />
              </div>
              <label>Address</label>
              <input type="text" placeholder='(e.g Laguna Calamba)' value={address} onChange={e => setAddress(e.target.value)} />
              <label>Description</label>
              <input type="text" placeholder='(e.g Near Island )' value={locDescription} onChange={e => setLocDescription(e.target.value)} />
              <button onClick={e => setHidden('')}> Cancel </button>
              <button onClick={addStartLocation} className="btn-startLocation"> Save </button>
            </div>
          </div>
        </div>
      }

      {
        hidden === 'location' &&
        <div className="AddModal">
          <div className="AddModal-locations">
            <h3>Locations +</h3>
            <div>
              <label>Location Name</label>
              <input type="text" placeholder='(e.g Cebu)' value={locationName} onChange={e => setLocationName(e.target.value)} />
              <div className="AddModal-coordinates">
                <label>Latitude</label>
                <input type="number" placeholder='(e.g 121.00000)' value={latitude} onChange={e => setLatitude(e.target.value)} />
                <label>Longitude</label>
                <input type="text" placeholder='(e.g 12.00000)' value={longitude} onChange={e => setLongitude(e.target.value)} />
              </div>
              <label>Address</label>
              <input type="text" placeholder='(e.g Manila)' value={address} onChange={e => setAddress(e.target.value)} />
              <label>Description</label>
              <input type="text" placeholder='(e.g Island Nowhere )' value={locDescription} onChange={e => setLocDescription(e.target.value)} />
              <label>Days</label>
              <input className="days" type="number" placeholder='(e.g 5)' value={day} onChange={e => setDay(e.target.value)} />
              <div className="AddModal-addedLocation">
                {
                  locations && locations.map((l) => {
                    return <p>{l.address},</p>

                  })
                }
              </div>
              <button onClick={e => setHidden('')}> Cancel </button>
              <button className="btn-addLocation" onClick={addLocation}> Add Location +</button>
            </div>
          </div>
        </div>
      }

      {
        hidden === 'tags' &&
        <div className="AddModal">
          <div className="AddModal-tags">
            <h3>Tags +</h3>
            <div>
              <label>Tag Name</label>
              <input type="text" placeholder='(e.g Ilocos)' value={tags} onChange={e => setTags(e.target.value)} />
              <div className="AddModal-addedTags">
                {
                  arrTags && arrTags.map((t) => {
                    return <p>{t},</p>

                  })
                }
              </div>
              <button onClick={e => setHidden('')}> Cancel </button>
              <button className="btn-addTags" onClick={addTags}> Add Tags +</button>
            </div>
          </div>
        </div>
      }

      {
        hidden === 'tourGuide' &&
        <div className="AddModal">
          <div className="AddModal-tour-guide">
            <h3>Tour guide +</h3>
            <div>
              <label>Tour Guide ID</label>
              <input type="text" placeholder='(e.g 62de950502bb955156e1ca69)' value={tourGuide} onChange={e => setTourGuide(e.target.value)} />
              <div className="AddModal-addedTourGuide">
                {
                  arrTourGuide && arrTourGuide.map((t) => {
                    return <p>{t},</p>

                  })
                }
              </div>
              <button onClick={e => setHidden('')}> Cancel </button>
              <button className="btn-addTourGuide" onClick={addTourGuide}> Add Tour guide +</button>
            </div>
          </div>
        </div>
      }

      {
        modal === true &&
        <div className="success-modal">
          <div >
            <p>Tour added Successfully</p>
          </div>
        </div>
      }

      {/* {
        spinner === true &&
        <div class="lds-hourglass"></div>
      } */}
    </>
  )
}
export default AddEditTours;