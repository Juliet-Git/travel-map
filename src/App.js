import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
// import * as timeago from "timeago.js";
// import {format} from 'dayjs'
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./app.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faStar } from "@fortawesome/free-solid-svg-icons";
import Register from "./components/register";
import Login from "./components/login"

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem('user'));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false);
  
  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleAddCLick = (e) => {
    console.log(e.lngLat);
    const { lng, lat } = e.lngLat;
    setNewPlace({
      lng,
      lat,
    });
  };

  const handleMarkerClick = (id) => {
    console.log(id);
    setCurrentPlaceId(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.lng,
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null)
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  }
  
  return (
    <div className="App">
      <Map
        initialViewState={{
          longitude: 17,
          latitude: 46,
          zoom: 4,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        onDblClick={handleAddCLick}
      >
        {pins.map((p) => (
          <>
            <Marker id longitude={p.long} latitude={p.lat} anchor="bottom">
              <div>
                <FontAwesomeIcon
                  onClick={() => handleMarkerClick(p._id)}
                  icon={faLocationDot}
                  style={{
                    color: p.username === currentUser ? "tomato" : "slateblue",
                    cursor: "pointer",
                  }}
                />
              </div>
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                key={p._id}
                longitude={p.long}
                latitude={p.lat}
                anchor="left"
                closeButton={true}
                closeOnClick={false}
                onClose={() => console.log(currentPlaceId)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(
                      <FontAwesomeIcon icon={faStar} className="star" />
                    )}
                  </div>
                  <label>Information</label>
                  {p.username && (
                    <span className="username">
                      Created by <b>{p.username}</b>
                    </span>
                  )}
                  {!p.username && (
                    <span className="date">
                      No. Card <br /> {p._id}
                    </span>
                  )}
                  {/* <span className="date">{format((p.createdAt))}</span> */}
                </div>
              </Popup>
            )}
          </>
        ))}
        {newPlace && (
          <Popup
            longitude={newPlace.lng}
            latitude={newPlace.lat}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  placeholder="Enter a title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea
                  placeholder="Say something about this place"
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitBtn" type="submit">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        )}
        {currentUser ? (
          <button className="btn logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="btns">
            <button className="btn login" onClick={() => setShowLogin(true)}>
              Login
            </button>
            <button
              className="btn register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
      {showRegister && <Register setShowRegister={setShowRegister} />}
      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          myStorage={myStorage}
          setCurrentUser={setCurrentUser}
        />
      )}
      </Map>
    </div>
  );
}

export default App;
