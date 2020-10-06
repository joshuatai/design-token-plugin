import React from "react";
import ThemeModesProvider from '../ThemeModeProvider';
import GroupProvider from '../GroupProvider';
import APIProvider from '../APIProvider';
const DataProvider = ({ children }) => {
    return (React.createElement(APIProvider, null,
        React.createElement(ThemeModesProvider, null,
            React.createElement(GroupProvider, null, children))));
};
DataProvider.propTypes = {};
DataProvider.displayName = "DataProvider";
export default DataProvider;
