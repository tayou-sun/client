import React, { Component } from "react";
import { NavLink } from "react-router-dom";

export default class DataCollector extends Component {
  render() {
    return (
      <div className="dataCollector">
        <div>
          <NavLink to="/configurator">
            <div className="btn">Конфигуратор форм</div>
          </NavLink>
        </div>
        <div>
          <NavLink to="/campaigns">
            <div className="btn">Кампании</div>
          </NavLink>
        </div>
      </div>
    );
  }
}
