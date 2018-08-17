import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import Icons from "icons/icons_sprite.svg"; // Path to your icons.svg

// const Icon = ({ name, color, size }) => (
//   <div className="icon-wrapper">
//     <svg className={`icon icon_${name}`} fill={color} width={size} height={size}>
//       <use xlinkHref={`${Icons}#icon_${name}`} />
//     </svg>
//   </div>
// );

const Icon = ({ name, color, size }) => {
  return (
    <div className={`icon icon__${name}`}>
      <svg className={`icon__svg`} fill={color} width={size} height={size}>
        <use xlinkHref={`${Icons}#icon_${name}`} />
      </svg>
    </div>
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.number
};

export default Icon;
