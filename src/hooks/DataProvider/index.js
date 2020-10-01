import React from "react";
import ThemeModesProvider from '../ThemeModeProvider';
import APIProvider from '../APIProvider';
const DataProvider = ({ children }) => {
    return (React.createElement(APIProvider, null,
        React.createElement(ThemeModesProvider, null, children)));
};
DataProvider.propTypes = {};
DataProvider.displayName = "DataProvider";
export default DataProvider;
