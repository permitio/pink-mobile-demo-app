import React, { useState, useEffect } from "react";
import TopNavigation from "./components/TopNavigation";
import { Box, Text, VStack } from "@chakra-ui/react";

import ManagerTab from "./components/ManagerTab";
import RepresentativeTab from "./components/RepresentativeTab";
import RepresentativesDropdown from "./components/RepresentativesDropdown";
import UserTab from "./components/UserTab";

export default function Home() {
	const [tabValue, setTabValue] = useState(0);
	const [representatives, setRepresentatives] = useState([]);
	const [selectedRepresentative, setSelectedRepresentative] = useState("");
	const [allUsers, setAllUsers] = useState([]);

	console.log('change that require policy change');

	async function fetchRepresentatives() {
		const response = await fetch("/api/representative", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-User": "albus@pink.mobile",
			},
		});
		const jsonResponse = await response.json();
		setRepresentatives(jsonResponse.representatives);
	}

	async function fetchUsers() {
		const response = await fetch("/api/user", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-User": "albus@pink.mobile",
			},
		});
		const jsonResponse = await response.json();
		setAllUsers(jsonResponse);
	}

	useEffect(() => {
		fetchRepresentatives();
		fetchUsers();
	}, []);

	const handleTabChange = (value) => {
		setTabValue(value);
	};

	const addUserToRepresentative = async (repId, userEmail) => {
		const url = `/api/representative/${repId}/${userEmail}`;
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-User": "albus@pink.mobile",
				},
			});
			if (response.ok) {
				console.log("User added successfully");
				await fetchRepresentatives();
			}
		} catch (error) {
			console.error("Error adding user:", error);
		}
	};

	const unassignUserFromRepresentative = async (repId, userId) => {
		const url = `/api/representative/${repId}/${userId}`;
		try {
			const response = await fetch(url, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"X-User": "albus@pink.mobile",
				},
			});
			if (response.ok) {
				console.log("User unassigned successfully");
				await fetchRepresentatives();
			}
		} catch (error) {
			console.error("Error unassigning user:", error);
		}
	};

	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			marginTop={"60px"}
		>
			<Text fontSize="xl" color="pink.500" mb={4}>
				Pink Mobile
			</Text>
			<TopNavigation onTabChange={handleTabChange} tabValue={tabValue} />
			<VStack
				width="100%"
				display="flex"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				spacing={4}
			>
				{tabValue === 0 ? (
					<ManagerTab
						representatives={representatives}
						unassignUserFromRepresentative={unassignUserFromRepresentative}
						addUserToRepresentative={addUserToRepresentative}
					/>
				) : tabValue === 1 ? (
					<RepresentativeTab
						representatives={representatives}
						selectedRepresentative={selectedRepresentative}
						setSelectedRepresentative={setSelectedRepresentative}
					>
						<RepresentativesDropdown
							representatives={representatives}
							selectedRepresentative={selectedRepresentative}
							onRepresentativeChange={(event) =>
								setSelectedRepresentative(event.target.value)
							}
						/>
					</RepresentativeTab>
				) : (
					<UserTab allUsers={allUsers} />
				)}
			</VStack>
		</Box>
	);
}
