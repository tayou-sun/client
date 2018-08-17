import React from "react";

const Loader = ({ enabled }) => {
  if (!enabled) return null;
  return (
    <div className="loaderContainer">
      <div className="loader" />
    </div>
  );
};

export default Loader;
