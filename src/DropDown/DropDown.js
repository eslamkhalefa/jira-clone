/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useRef } from "react";
import { issueType, Priority } from "../DummyData";
import "./dropdown.scss";
import DropDownIcon from "./DropDownIcon";
import DropDownImage from "./DropDownImage";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

function DropDown({ options, label, selected, onSelectedChange }) {
  const ref = useRef();

  const [open, setOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };

  useOnClickOutside(ref, () => setOpen(!open));

  useEffect(() => {
    const results = options.filter((result) => {
      return result.label
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase().trim());
    });

    setSearchResults(results);
  }, [options, searchTerm]);

  const handleClose = () => {
    setSearchTerm("");
  };

  if (!searchResults) return options;

  return (
    <div>
      <label htmlFor="label" className="dropdown__label">
        {label}
      </label>
      <div className="dropdown">
        <div
          role="button"
          tabIndex={0}
          className="dropdown__bar"
          onClick={() => setOpen(!open)}
          onKeyPress={() => setOpen(!open)}
        >
          {selected === issueType || Priority ? (
            <DropDownIcon icon={selected.icon} color={selected.color} />
          ) : (
            <DropDownImage src={selected.src} />
          )}
          <span>{selected.label}</span>
          <svg className="dropdown__icon-bar">
            <use xlinkHref="./img/sprite.svg#icon-chevron-down"></use>
          </svg>
        </div>

        {open && (
          <div className="dropdown__menu " ref={ref}>
            <input
              type="text"
              className="dropdown__input"
              placeholder="Search"
              value={searchTerm}
              onChange={handleChange}
            />
            <svg className="dropdown__icon-close" onClick={handleClose}>
              <use xlinkHref="./img/sprite.svg#icon-clear"></use>
            </svg>
            <div
              role="button"
              tabIndex={0}
              className="dropdown__select"
              onClick={() => setOpen(!open)}
            >
              {searchResults.map((option) => {
                if (option.value === selected.value) {
                  return null;
                }
                return (
                  <div
                    role="button"
                    tabIndex={0}
                    className="dropdown__option"
                    key={option.value}
                    onClick={() => {
                      onSelectedChange(option);
                      setOpen(!open);
                    }}
                    onKeyPress={() => {
                      onSelectedChange(option);
                      setOpen(!open);
                    }}
                  >
                    {options == Priority || issueType ? (
                      <DropDownIcon icon={option.icon} color={option.color} />
                    ) : (
                      <DropDownImage src={option.src} />
                    )}
                    {option.label}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DropDown;
