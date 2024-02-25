import React, { useState, useEffect } from 'react';
import {
    Box,
    Text,
    Select,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    useDisclosure,
    Badge,
    Alert, AlertIcon, AlertTitle, AlertDescription, Flex
  } from '@chakra-ui/react';


const RepresentativeTab = ({ representatives, selectedRepresentative, setSelectedRepresentative }) => {
    const [selectedUser, setSelectedUser] = useState('');
    const [allUsers, setAllUsers] = useState([]); 
    const [userData, setUserData] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [error, setError] = useState("");
  
    useEffect(() => {

        const fetchUserData = async () => {
            if (!selectedUser) return;

            try {
              const response = await fetch(`/api/account/${selectedUser}`, {
                method: 'GET', 
                headers: {
                  'Content-Type': 'application/json',
                  'X-User': selectedRepresentative,
                },
              });
              const data = await response.json();
              setUserData(data);
            } catch (error) {
                setUserData(null);
            }
          };
      
          fetchUserData();

        const fetchAllUsers = async () => {
          try {
            const response = await fetch(`/api/user`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'X-User': selectedRepresentative,
              },
            });
            if (response.ok) {
              const data = await response.json();
              setAllUsers(data); 
              console.log(data, selectedRepresentative);
            } else {
              console.error('Failed to fetch users');
              setAllUsers([]);
            }
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        };
    
        if (selectedRepresentative) {
          fetchAllUsers();
        }
      }, [selectedRepresentative, selectedUser]);
  
    const handleRepresentativeChange = (event) => {
      setSelectedRepresentative(event.target.value);
      setSelectedUser('');
    };
  
    const handleUserChange = (event) => {
      setSelectedUser(event.target.value);
    };

    const handlePlanChangeRep = async () => {
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
            setUserData({...userData, plan: newPlan});
        } else {
            console.log('Failed to change plan');
            const error = await response.json(); 
            setUserData(error);
        }
    } catch (error) {
        console.error('Error changing plan:', error);
        setError(error.message || "An error occurred while changing the plan.");
    }
    onClose(); 
    };
    
    const currentRepresentative = representatives?.find(rep => rep.key === selectedRepresentative);

    console.log(userData);
  
    return (
        <Box mt={8} mx={4} p={4} boxShadow="xl" borderRadius="lg" bg="white" width={"320px"}>
          <Select placeholder="Select Representative" size="sm" value={selectedRepresentative} onChange={handleRepresentativeChange} mb={4}>
            {representatives?.map((rep) => (
              <option key={rep.key} value={rep.key}>{rep.first_name} {rep.last_name}</option>
            ))}
          </Select>
          {currentRepresentative && currentRepresentative.users && (
            <Select placeholder="Select User" size="sm" value={selectedUser} onChange={handleUserChange} mb={4}>
              {allUsers?.map((user) => (
                <option key={user.key} value={user.key}>{user.first_name} {user.last_name}</option>
              ))}
            </Select>
          )}
          {selectedUser && userData && (
            <Box p={4} borderRadius="sm" borderWidth="1px" display={"flex"} alignItems={"center"} justifyContent={"center"}>
              {userData.error ? (
                <Alert status="error" borderRadius="lg" justifyContent="center" bg="pink.50" display={"flex"} flexDirection={"column"}>
                <Flex direction="column" align="center" justify="center" p={5} display={"flex"}  flexDirection={"row"}>
                  <AlertIcon boxSize="20px" mr={2} color="red.500" />
                  <AlertTitle mb={1} fontSize="sm" color="red.500">
                    Error!
                  </AlertTitle>
                </Flex>
                  <Flex>
                  <AlertDescription maxWidth="sm" textAlign="center" fontSize="sm" mb={4}>
                    {userData.error}.
                  </AlertDescription>
                </Flex>
              </Alert>
              ) : (
                <Box>
                  <Text fontSize="sm" mb={4} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                        User Plan: 
                        <Badge ml={2} colorScheme={userData.plan === 'VIP' ? 'green' : 'blue'}>
                        {userData.plan}
                        </Badge>
                    </Text>
                    <Button size="xs" colorScheme="blue" onClick={onOpen}>
                        Change User's Plan
                    </Button>
                  <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader fontSize="md">Change Plan</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody fontSize="sm">
                        User {userData.firstName} {userData.lastName} currently has the plan {userData.plan}. Do you wish to {userData.plan === 'Standard' ? 'upgrade' : 'downgrade'}?
                      </ModalBody>
                      <ModalFooter>
                        <Button variant="ghost" size="xs" colorScheme="blue" mr={3} onClick={onClose}>
                          Cancel
                        </Button>
                        <Button colorScheme="blue" size="xs" onClick={handlePlanChangeRep}>
                          {userData.plan === 'Standard' ? 'Upgrade to VIP' : 'Downgrade to Standard'}
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </Box>
              )}
            </Box>
          )}
        </Box>
      );
    };
    
    export default RepresentativeTab;
  