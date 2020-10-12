import React from "react";
import ThemeModesProvider from '../ThemeModeProvider';
import GroupProvider from '../GroupProvider';
import APIProvider from '../APIProvider';
import TokenSettingProvider from '../TokenSettingProvider';
import PropertySettingProvider from '../PropertySettingProvider';
const DataProvider = ({ children }) => {
    return (React.createElement(APIProvider, null,
        React.createElement(ThemeModesProvider, null,
            React.createElement(GroupProvider, null,
                React.createElement(TokenSettingProvider, null,
                    React.createElement(PropertySettingProvider, null, children))))));
};
DataProvider.propTypes = {};
DataProvider.displayName = "DataProvider";
export default DataProvider;
