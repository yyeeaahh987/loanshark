import PropTypes from "prop-types";
import React, { Component } from "react";
import "./radio.scss";

export class Radio extends Component {
  state = {};

  render() {
    const { theme, selected, onChange, text, value, disabled } = this.props;
    console.log(theme)
    return (
      <div
        className="modern-radio-container"
        disabled={disabled}
        onClick={() => {
          onChange(value);
        }}
      >
        <div
          className={`radio-outer-circle ${value !== selected && "unselected"}`}
        >
          <div
            className={`radio-inner-circle ${value !== selected &&
              "unselected-circle"}`}
          />
        </div>
        <div className={`helper-text ${theme === "light" ? "helper-text-light" : "helper-text-dark"}`}>{text}</div>
      </div>
    )
  }
}

Radio.propTypes = {
  theme: PropTypes.oneOf(["light", "dark"]),
  text: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};
