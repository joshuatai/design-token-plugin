import React from "react";
import APIProvider from '../APIProvider';
import TabProvider from '../TabProvider';
import ThemeModesProvider from '../ThemeModeProvider';
import GroupProvider from '../GroupProvider';
import TokenProvider from '../TokenProvider';
import PropertyProvider from '../PropertyProvider';
import TokenSettingProvider from '../TokenSettingProvider';
import PropertySettingProvider from '../PropertySettingProvider';
import FontProvider from '../FontProvider';
const DataProvider = ({ children }) => {
    return (React.createElement(APIProvider, null,
        React.createElement(TabProvider, null,
            React.createElement(ThemeModesProvider, null,
                React.createElement(GroupProvider, null,
                    React.createElement(TokenProvider, null,
                        React.createElement(PropertyProvider, null,
                            React.createElement(TokenSettingProvider, null,
                                React.createElement(PropertySettingProvider, null,
                                    React.createElement(FontProvider, null, children))))))))));
};
DataProvider.propTypes = {};
DataProvider.displayName = "DataProvider";
export default DataProvider;
