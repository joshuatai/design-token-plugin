import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";

import ThemeModesProvider from '../ThemeModeProvider';
import GroupProvider from '../GroupProvider';
import APIProvider from '../APIProvider';

const DataProvider = ({ children }) => {
  return (
    <APIProvider>
      <ThemeModesProvider>
        <GroupProvider>
          {children}
        </GroupProvider>
      </ThemeModesProvider>
    </APIProvider>
  );
};

DataProvider.propTypes = {
};
DataProvider.displayName = "DataProvider";

export default DataProvider;
