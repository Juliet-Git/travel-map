import "./login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import axios from "axios";

export default function Login({ setShowLogin, myStorage, setCurrentUser }) {
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post("/users/login", user);
      myStorage.setItem("user", res.data.username);
      setCurrentUser(res.data.username)
      setShowLogin(false)
      setError(false);
    } catch (err) {
      setError(true);
      console.log(err);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <FontAwesomeIcon icon={faLocationDot} />
        LamaPin
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button type="submit" className="loginBtn">
          login
        </button>
        {error && (
          <span className="failure">
            Something went wrong. Please try again
          </span>
        )}
      </form>
      <FontAwesomeIcon
        className="closeBtn"
        icon={faTimes}
        onClick={() => setShowLogin(false)}
      />
    </div>
  );
}
