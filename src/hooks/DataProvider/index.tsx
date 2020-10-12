import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";

import ThemeModesProvider from '../ThemeModeProvider';
import GroupProvider from '../GroupProvider';
import APIProvider from '../APIProvider';
import TokenSettingProvider from '../TokenSettingProvider';
import PropertySettingProvider from '../PropertySettingProvider';

const DataProvider = ({ children }) => {
  return (
    <APIProvider>
      <ThemeModesProvider>
        <GroupProvider>
          <TokenSettingProvider>
            <PropertySettingProvider>
            {children}
            </PropertySettingProvider>
          </TokenSettingProvider>
        </GroupProvider>
      </ThemeModesProvider>
    </APIProvider>
  );
};

DataProvider.propTypes = {
};
DataProvider.displayName = "DataProvider";

export default DataProvider;
