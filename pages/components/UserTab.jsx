import React, { useState, useEffect } from 'react';
import { Box, Text, Select, VStack, Badge, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';

const UserTab = ({ allUsers }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [userData, setUserData] = useState(null); 
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const user = allUsers.find(user => user.key === selectedUser);
    setUserData(user); 
  }, [selectedUser, allUsers]);

  const handleChange = (event) => {
    setSelectedUser(event.target.value);
    setErrorMessage('');
  };

  const handlePlanChangeUser = async () => {
    setErrorMessage('');
    const userKey = selectedUser;
    const newPlan = userData.attributes.Plan === 'Standard' ? 'VIP' : 'Standard';

    try {
      const response = await fetch(`/api/plan/${userKey}/${newPlan}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User': userKey, 
        },
        body: JSON.stringify({ Plan: newPlan }) 
      });

      if (response.ok) {
        console.log('Plan changed successfully');
        setUserData({ ...userData, attributes: { ...userData.attributes, Plan: newPlan } });
      } else {
        const errorData = await response.json(); 
        setErrorMessage(errorData.error);
      }
    } catch (error) {
      console.error('Error changing plan:', error);
      setErrorMessage('An unexpected error occurred.');
    }
    onClose(); 
  };

  return (
    <Box mt={8} mx={4} p={4} boxShadow="xl" borderRadius="lg" bg="white" width={"450px"}>
      <VStack spacing={4}>
        <Select placeholder="Select User" size="sm" value={selectedUser} onChange={handleChange}>
          {allUsers.map((user) => (
            <option key={user.key} value={user.key}>
              {`${user.first_name} ${user.last_name}`}
            </option>
          ))}
        </Select>
        {userData && (
          <VStack spacing={3} align="stretch" mt={4}>
            <Text fontSize="sm">Name: {userData.first_name} {userData.last_name}</Text>
            <Text fontSize="sm">Email: {userData.email}</Text>
            <Text fontSize="sm">
              Plan:
              <Badge ml={2} colorScheme={userData.attributes.Plan === 'VIP' ? 'green' : 'blue'}>
                {userData.attributes.Plan}
              </Badge>
            </Text>
            <Button size={"xs"} my={4} colorScheme="blue" onClick={onOpen}>
              Change Plan
            </Button>
            {errorMessage && (
                <Text color="red.500" fontSize="sm">{errorMessage}.</Text>
            )}
          </VStack>
        )}
      </VStack>

      {/* Modal for changing the plan */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={"sm"}>Change User Plan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize={"sm"}>
              Are you sure you want to change the plan for {userData?.first_name} {userData?.last_name}?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button size={"xs"} variant="ghost" onClick={onClose}>Cancel</Button>
            <Button size={"xs"} colorScheme="blue" onClick={handlePlanChangeUser}>
              Confirm Change
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserTab;
