import React from 'react';
import { Select } from '@chakra-ui/react';

const RepresentativesDropdown = ({ representatives, selectedRepresentative, onRepresentativeChange }) => {
  return (
    <Select 
      placeholder="Select Representative" 
      size="sm" 
      value={selectedRepresentative} 
      onChange={onRepresentativeChange}
      variant="outline"
      width="100%"
    >
      {representatives?.map((rep) => (
        <option key={rep.key} value={rep.key}>{`${rep.first_name} ${rep.last_name}`}</option>
      ))}
    </Select>
  );
};

export default RepresentativesDropdown;
