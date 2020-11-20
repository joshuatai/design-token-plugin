import React, { FC } from "react";
import Logo from './APISetting/Logo';

const Loader:FC = () => {
  return (
    <div className="tonic-loader">
      <Logo></Logo>
      <div className="loader-container">
        <div className="loader loader-large"></div>
      </div>
    </div>
  );
}

export default Loader;
