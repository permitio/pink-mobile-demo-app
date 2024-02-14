import React, { useState, useEffect } from 'react';
import { Button, Typography, Select, MenuItem, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';



const RepresentativeTab = ({ representatives, selectedRepresentative, setSelectedRepresentative }) => {
    const [selectedUser, setSelectedUser] = useState('');
    const [userData, setUserData] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

  
    useEffect(() => {
      if (!selectedUser) return;
  
      const fetchUserData = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/account/${selectedUser}`, {
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json',
              'X-User': selectedRepresentative,
            },
          });
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          setUserData(null);
        }
      };
  
      fetchUserData();
    }, [selectedUser, selectedRepresentative]);
  
    const handleRepresentativeChange = (event) => {
      setSelectedRepresentative(event.target.value);
      setSelectedUser('');
    };
  
    const handleUserChange = (event) => {
      setSelectedUser(event.target.value);
    };

    const handleDialogOpen = () => {
        setOpenDialog(true);
      };
    
    const handleDialogClose = () => {
    setOpenDialog(false);
    };

    const handleChangePlan = async () => {
    const newPlan = userData.plan === 'Standard' ? 'VIP' : 'Standard';
    try {
        const response = await fetch(`/api/plan/${selectedUser}/${newPlan}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-User': selectedRepresentative,
        },
        });

        if (response.ok) {
        console.log('Plan changed successfully');
        // Optionally refresh user data here to reflect the change
        setUserData({...userData, plan: newPlan}); // Update local state to reflect new plan
        } else {
        console.error('Failed to change plan');
        }
    } catch (error) {
        console.error('Error changing plan:', error);
    }
    setOpenDialog(false); // Close dialog after attempting to change plan
    };
    
  
    const currentRepresentative = representatives.find(rep => rep.key === selectedRepresentative);
  
    return (
        <div>
          <Typography>Representative Specific Content</Typography>
          <FormControl fullWidth>
            <InputLabel>Representative</InputLabel>
            <Select
              value={selectedRepresentative}
              onChange={handleRepresentativeChange}
              displayEmpty
            >
              {representatives.map((rep) => (
                <MenuItem key={rep.key} value={rep.key}>{rep.first_name} {rep.last_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {currentRepresentative && currentRepresentative.users && (
            <FormControl fullWidth>
              <InputLabel>User</InputLabel>
              <Select
                value={selectedUser}
                onChange={handleUserChange}
                displayEmpty
              >
                {currentRepresentative.users.map((user) => (
                  <MenuItem key={user.key} value={user.key}>{user.first_name} {user.last_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {selectedUser && userData && (
            <>
                {selectedUser !== '' ? <p>User Plan: {userData && userData.plan}</p> : null}
              <Button variant="contained" color="primary" onClick={handleDialogOpen}>
                Change User's Plan
              </Button>
              <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Change Plan</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    User {userData.firstName} {userData.lastName} currently has the plan {userData.plan}. Do you wish to {userData.plan === 'Standard' ? 'upgrade' : 'downgrade'}?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleDialogClose} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleChangePlan} color="primary" autoFocus>
                    {userData.plan === 'Standard' ? 'Upgrade to VIP' : 'Downgrade to Standard'}
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </div>
      );
    };
    
    export default RepresentativeTab;
  