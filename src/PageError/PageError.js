import React from "react";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import ErrorPageSVG from "../ErrorPageSVG/ErrorPageSVG";
import "./page-error.scss";

function PageErorr() {
  return (
    <div className="page-error">
      <ErrorPageSVG />
      <h1 className="heading-primary">404 Error.</h1>
      <p className="paragraph">We cant find the page youre looking for.</p>
      <div className="u-margin-top-medium">
        <Link to="/">
          <Button modifier="filled-blue">Go To Kanban Board</Button>
        </Link>
      </div>
    </div>
  );
}

export default PageErorr;
