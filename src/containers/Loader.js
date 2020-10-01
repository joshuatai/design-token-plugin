import React from "react";
import Logo from './APISetting/Logo';
const Loader = () => {
    return (React.createElement("div", { className: "tonic-loader" },
        React.createElement(Logo, null),
        React.createElement("div", { className: "loader-container" },
            React.createElement("div", { className: "loader loader-large" }))));
};
export default Loader;
