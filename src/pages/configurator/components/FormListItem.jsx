import React from "react";

const FormListItem = ({ name, description, period, onClick }) => (
  <div className="card" onClick={onClick}>
    <div className="card-body">
      <div className="card-title">{name}</div>
      <div className="card-text">
        <div>{description}</div>
        <div>{period}</div>
      </div>
    </div>
  </div>
);

export default FormListItem;
