import "./SearchBar.scss";
import { useState } from "react";

const SearchBar = () => {
  const [startLocation, setStartLocation] = useState('');



  return (
    <div className="SearchBar">
      <h3>Where to?</h3>

      <div className="SearchBar__options">
        <div className="searchForm">
          <label> Starting Location</label>
          <div className="searchForm__text">
            <img src="https://cdn-icons-png.flaticon.com/512/684/684809.png" alt="icon" />
            <input type="text" placeholder="Where do you want to go?" onChange={e => setStartLocation(e.target.value)} />
          </div>

        </div>

        <div className="searchForm">
          <button> Search </button>
        </div>

      </div>
    </div>
  );
}

export default SearchBar;
