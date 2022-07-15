import "./register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import axios from "axios";

export default function Register({setShowRegister}) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axios.post(
        "https://portfolio-progetto-3.herokuapp.com/api/users/register",
        newUser
      );
      setError(false);
      setSuccess(true);
    } catch (err) {
      setError(true);
      console.log(err);
    }
  };

  return (
    <div className="registerContainer">
      <div className="logo">
        <FontAwesomeIcon icon={faLocationDot} />
        LamaPin
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="email" placeholder="email" ref={emailRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button type="submit" className="registerBtn">
          Register
        </button>
        {success && (
          <span className="success">Successfull. You can Login now</span>
        )}
        {error && (
          <span className="failure">Something wnt wrong. Please try again</span>
        )}
      </form>
      <FontAwesomeIcon
        className="closeBtn"
        icon={faTimes}
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
}

