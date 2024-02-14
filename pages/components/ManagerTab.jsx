import React from 'react';
import { Typography, List, ListItem, ListItemText, Button, TextField } from '@material-ui/core';

const ManagerTab = ({ representatives, unassignUserFromRepresentative, addUserToRepresentative, inputValue, handleInputChange }) => {
  return (
    <div>
      {representatives.map((rep) => (
        <div key={rep.key}>
          <Typography variant="h6">{`${rep.first_name} ${rep.last_name}`}</Typography>
          <List>
            {rep.users &&
              rep.users.map((user) => (
                <ListItem key={user.key}>
                  <ListItemText
                    primary={`${user.first_name} ${user.last_name}`}
                    secondary={`Email: ${user.email}`}
                  />
                  <Button
                    onClick={() => unassignUserFromRepresentative(rep.key, user.key)}
                    style={{ marginLeft: "10px" }}
                  >
                    Unassign User
                  </Button>
                </ListItem>
              ))}
          </List>
          <TextField
            label="Add User Email"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={(event) => event.key === "Enter" && addUserToRepresentative(rep.id)}
          />
          <Button
            onClick={() => addUserToRepresentative(rep.id)}
            style={{ marginTop: "10px" }}
          >
            Add User
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ManagerTab;
