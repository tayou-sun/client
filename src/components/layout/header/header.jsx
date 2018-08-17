import React from "react";
import { NavLink } from "react-router-dom";

export default class Header extends React.Component {
  render() {
    return (
      <header className="header">
        <div className="header__menu">
          <NavLink className="header__menu-link" exact to="/">
            Карта
          </NavLink>
          <NavLink className="header__menu-link" to="/objects">
            Объекты
          </NavLink>
          <NavLink className="header__menu-link" to="/indicators">
            Показатели
          </NavLink>
          <NavLink className="header__menu-link" to="/reports">
            Отчёты
          </NavLink>
          <NavLink className="header__menu-link" to="/data-collector">
            Сбор данных
          </NavLink>
        </div>
      </header>
    );
  }
}
