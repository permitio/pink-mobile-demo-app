import React, { useState } from "react";
import utilStyles from "../styles/utils.module.css";
import TopNavigation from "./components/TopNavigation";
import {
	TextField,
	Typography,
	List,
	ListItem,
	ListItemText,
	Box,
} from "@material-ui/core";

export default function Home() {
	const [tabValue, setTabValue] = useState(0);
	const [inputValue, setInputValue] = useState("");
	const [representatives, setRepresentatives] = useState([
		{
			id: 1,
			name: "Representative A",
			users: ["Allowed User A", "Allowed User B"],
			canAddUser: true,
		},
		{
			id: 2,
			name: "Representative B",
			users: ["Allowed User A", "Allowed User C"],
			canAddUser: false,
		},
	]);

	const handleTabChange = (value) => {
		setTabValue(value);
	};

	const handleInputChange = (event) => {
		setInputValue(event.target.value);
	};

	const handleKeyPress = (event, repId) => {
		if (event.key === "Enter") {
			console.log("User added:", inputValue);
			// Update the representatives state to include the new user
			setRepresentatives((reps) =>
				reps.map((rep) => {
					if (rep.id === repId && rep.canAddUser) {
						return { ...rep, users: [...rep.users, inputValue] };
					}
					return rep;
				})
			);
			setInputValue("");
		}
	};

	return (
		<Box>
			<Typography component="h1" variant="h5" style={{ color: "pink" }}>
				Pink-Mobile
			</Typography>
			<TopNavigation onTabChange={handleTabChange} tabValue={tabValue} />
			<Box>
				<section className={utilStyles.headingMd}>
					{tabValue === 0 &&
						representatives.map((rep, index) => (
							<div key={rep.id}>
								<Typography variant="h6">{rep.name}</Typography>
								<List>
									{rep.users.map((user, userIndex) => (
										<ListItem key={userIndex}>
											<ListItemText primary={user} />
										</ListItem>
									))}
								</List>
								{rep.canAddUser && (
									<TextField
										label="Add another user"
										value={inputValue}
										onChange={handleInputChange}
										onKeyPress={(event) => handleKeyPress(event, rep.id)}
										fullWidth
									/>
								)}
							</div>
						))}
				</section>
			</Box>
		</Box>
	);
}
