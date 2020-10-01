import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";

import ThemeModesProvider from '../ThemeModeProvider';
import APIProvider from '../APIProvider';

const DataProvider = ({ children }) => {
  return (
    <APIProvider>
      <ThemeModesProvider>
        {children}
      </ThemeModesProvider>
    </APIProvider>
  );
};

DataProvider.propTypes = {
};
DataProvider.displayName = "DataProvider";

export default DataProvider;
