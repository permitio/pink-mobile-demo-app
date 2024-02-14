import React from 'react';
import { AppBar, Tabs, Tab } from '@material-ui/core';

export default function TopNavigation({ onTabChange, tabValue }) {
  const handleTabChange = (event, newValue) => {
    onTabChange(newValue);
  };

  return (
    <AppBar position="static">
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Manager" />
        <Tab label="Representative" />
      </Tabs>
    </AppBar>
  );
}