import React, { useState, useEffect } from "react";
import utilStyles from "../styles/utils.module.css";
import TopNavigation from "./components/TopNavigation";
import {
	TextField,
	Typography,
	List,
	ListItem,
	ListItemText,
	Button,
	Box,
} from "@material-ui/core";
import ManagerTab from "./components/ManagerTab";
import RepresentativeTab from "./components/RepresentativeTab";
import RepresentativesDropdown from "./components/RepresentativesDropdown";

export default function Home() {
	const [tabValue, setTabValue] = useState(0);
	const [inputValue, setInputValue] = useState("");
	const [representatives, setRepresentatives] = useState([]);
	const [selectedRepresentative, setSelectedRepresentative] = useState("");

	async function fetchRepresentatives() {
		const response = await fetch("http://localhost:3000/api/representative", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-User": "albus@pink.mobile",
			},
		});
		const jsonResponse = await response.json();
		setRepresentatives(jsonResponse.representatives);
	}

	useEffect(() => {
		fetchRepresentatives();
	}, []);

	const handleTabChange = (value) => {
		setTabValue(value);
	};

	const handleInputChange = (event) => {
		setInputValue(event.target.value);
	};

	const addUserToRepresentative = async (repId) => {
		const url = `http://localhost:3000/api/representative/${repId}/${inputValue}`;
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
		setInputValue("");
	};

	const unassignUserFromRepresentative = async (repId, userId) => {
		const url = `http://localhost:3000/api/representative/${repId}/${userId}`;
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
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
			}}
		>
			<Typography component="h1" variant="h5" style={{ color: "pink" }}>
				Pink-Mobile
			</Typography>
			<TopNavigation onTabChange={handleTabChange} tabValue={tabValue} />
			<Box
				sx={{
					width: "80%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
				}}
			>
				{tabValue === 0 ? (
					<ManagerTab
						representatives={representatives}
						unassignUserFromRepresentative={unassignUserFromRepresentative}
						addUserToRepresentative={addUserToRepresentative}
						inputValue={inputValue}
						handleInputChange={handleInputChange}
					/>
				) : (
					<RepresentativeTab
						representatives={representatives}
						selectedRepresentative={selectedRepresentative}
						setSelectedRepresentative={setSelectedRepresentative}
					>
						{/* Optionally include additional content like error messages here */}
						<RepresentativesDropdown
							representatives={representatives}
							selectedRepresentative={selectedRepresentative}
							onRepresentativeChange={(event) =>
								setSelectedRepresentative(event.target.value)
							}
						/>
					</RepresentativeTab>
				)}
			</Box>
		</Box>
	);
}
