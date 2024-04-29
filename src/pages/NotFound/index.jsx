import React from "../../assets/react.svg";

import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <span className="not-found-image">
        <img src={React} alt="React" />
      </span>
      <h1>Oops! Page not found</h1>
      <p className="sorry-but-cont">
        Sorry, but the link you followed may be broken, or the page may have
        been moved.
      </p>
      <button className="btn2" onClick={() => navigate("/")}>
        Back to home
      </button>
    </div>
  );
};
export default NotFound;
