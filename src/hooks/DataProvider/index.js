import React from "react";
import APIProvider from '../APIProvider';
import ThemeModesProvider from '../ThemeModeProvider';
import GroupProvider from '../GroupProvider';
import TokenProvider from '../TokenProvider';
import PropertyProvider from '../PropertyProvider';
import TokenSettingProvider from '../TokenSettingProvider';
import PropertySettingProvider from '../PropertySettingProvider';
const DataProvider = ({ children }) => {
    return (React.createElement(APIProvider, null,
        React.createElement(ThemeModesProvider, null,
            React.createElement(GroupProvider, null,
                React.createElement(TokenProvider, null,
                    React.createElement(PropertyProvider, null,
                        React.createElement(TokenSettingProvider, null,
                            React.createElement(PropertySettingProvider, null, children))))))));
};
DataProvider.propTypes = {};
DataProvider.displayName = "DataProvider";
export default DataProvider;
