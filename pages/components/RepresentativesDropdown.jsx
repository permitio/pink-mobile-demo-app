import React from 'react';
import { MenuItem, Select } from '@material-ui/core';

const RepresentativesDropdown = ({ representatives, selectedRepresentative, onRepresentativeChange }) => {
  return (
    <Select
      value={selectedRepresentative}
      onChange={onRepresentativeChange}
      displayEmpty
      fullWidth
    >
      <MenuItem value="">
        <em>None</em>
      </MenuItem>
      {representatives.map((rep) => (
        <MenuItem key={rep.key} value={rep.key}>{`${rep.first_name} ${rep.last_name}`}</MenuItem>
      ))}
    </Select>
  );
};

export default RepresentativesDropdown;
