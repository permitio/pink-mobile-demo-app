import React from 'react';
import { Tabs, TabList, Tab } from '@chakra-ui/react';

export default function TopNavigation({ onTabChange, tabValue }) {
    
  const handleTabChange = (index) => {
    onTabChange(index);
  };

  return (
    <Tabs index={tabValue} onChange={handleTabChange} align='center'>
      <TabList>
        <Tab>Manager</Tab>
        <Tab>Representative</Tab>
        <Tab>User</Tab>
      </TabList>
    </Tabs>
  );
}
