import React from 'react';
import { AppBar, Tabs, Tab, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';

export default function TopNavigation({ onTabChange, tabValue }) {
  const handleTabChange = (event, newValue) => {
    onTabChange(newValue);
  };

  return (
    <AppBar position="static">
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Representative" />
        <Tab label="Manager" />
      </Tabs>
    </AppBar>
  );
}
