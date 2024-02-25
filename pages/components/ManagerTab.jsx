import React, { useState } from 'react';
import { Box, Text, List, ListItem, Button, Input, VStack } from '@chakra-ui/react';

const ManagerTab = ({ representatives, unassignUserFromRepresentative, addUserToRepresentative }) => {
  // Initialize state to manage input values for each representative
  const [inputValues, setInputValues] = useState({});

  const handleInputChange = (repId, value) => {
    setInputValues({
      ...inputValues,
      [repId]: value, // Update the input value for the specific representative
    });
  };

  return (
    <VStack spacing={2} mt={6} align="stretch">
      {representatives?.map((rep) => (
        <Box key={rep.key} p={5} boxShadow="md" borderRadius="lg" bg="white" my={3}>
          <Text fontSize="md" fontWeight="bold" mb={3}>{`${rep.first_name} ${rep.last_name}`}</Text>
          <List spacing={3}>
            {rep.users &&
              rep.users.map((user) => (
                <ListItem key={user.key} display="flex" justifyContent="space-between" alignItems="center" width={"100%"} py={2} mr={8} borderBottom="1px" borderColor="gray.200">
                  <Text fontSize="xs">{`${user.first_name} ${user.last_name} – ${user.email}`}</Text>
                  <Button colorScheme="red" size="xs" onClick={() => unassignUserFromRepresentative(rep.key, user.key)}>
                    Unassign
                  </Button>
                </ListItem>
              ))}
            {rep.users && rep.users.length === 0 && (
              <Text fontSize="xs" color="gray.500">No users assigned.</Text>
            )}
          </List>
          <Box mt={4} display="flex" alignItems="center">
            <Input
              placeholder="Add User Email"
              size="xs"
              value={inputValues[rep.key] || ''} // Use the value from the state
              onChange={(e) => handleInputChange(rep.key, e.target.value)} // Update the state on change
              onKeyPress={(event) => event.key === "Enter" && addUserToRepresentative(rep.id, inputValues[rep.key])}
              mr={8}
              flex="1"
              py={"3"}
            />
            <Button
              colorScheme="teal"
              size="xs"
              px={4}
              onClick={() => addUserToRepresentative(rep.id, inputValues[rep.key])}
            >
              Add
            </Button>
          </Box>
        </Box>
      ))}
    </VStack>
  );
};

export default ManagerTab;
