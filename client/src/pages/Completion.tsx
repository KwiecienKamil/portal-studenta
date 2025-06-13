import React from "react";
import { Link } from "react-router-dom";

const Completion = () => {
  return (
    <div>
      <h1>PAYMENT COMPLETED!</h1>
      <Link to="/payment">Back to home page</Link>
    </div>
  );
};

export default Completion;
