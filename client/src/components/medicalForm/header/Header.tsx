import * as React from "react";
import "css/header.css";

interface IHeaderProps {
  text: string;
}

const Header = (props: IHeaderProps) => (
  <div className="form-header-container">
    <p className="form-header">{props.text}</p>
  </div>
);

export default Header;
