import React, { FC, MouseEventHandler } from "react";

type T_BackIcon = {
  _ref,
  onClick: MouseEventHandler,
};
const BackIcon: FC<T_BackIcon> = ({ _ref, onClick }) => 
(
  <div ref={_ref} id="turn-back-btn" className="turn-back-btn" onClick={onClick}>
    <svg
      className="svg"
      width="8"
      height="13"
      viewBox="0 0 8 13"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 6.5l-.353-.354-.354.354.354.354L1 6.5zM6.647.146l-6 6 .707.708 6-6-.707-.708zm-6 6.708l6 6 .707-.708-6-6-.707.708z"
        fillRule="nonzero"
        fillOpacity="1"
        fill="inherit"
        stroke="none"
      ></path>
    </svg>
  </div>
);

export default BackIcon;
