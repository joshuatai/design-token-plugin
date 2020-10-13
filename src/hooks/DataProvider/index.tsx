import React from "react";
import APIProvider from '../APIProvider';
import ThemeModesProvider from '../ThemeModeProvider';
import GroupProvider from '../GroupProvider';
import TokenProvider from '../TokenProvider';
import PropertyProvider from '../PropertyProvider';
import TokenSettingProvider from '../TokenSettingProvider';
import PropertySettingProvider from '../PropertySettingProvider';

const DataProvider = ({ children }) => {
  return (
    <APIProvider>
      <ThemeModesProvider>
        <GroupProvider>
          <TokenProvider>
            <PropertyProvider>
              <TokenSettingProvider>
                <PropertySettingProvider>
                  {children}
                </PropertySettingProvider>
              </TokenSettingProvider>
            </PropertyProvider>
          </TokenProvider>
        </GroupProvider>
      </ThemeModesProvider>
    </APIProvider>
  );
};

DataProvider.propTypes = {
};
DataProvider.displayName = "DataProvider";

export default DataProvider;
