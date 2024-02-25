import {
	assignUser,
	authorize,
	listRepresentatives,
	unassignUser,
} from "../../../lib/authorizer";

const list = async (req, res) => {
	const user = req.headers["x-user"];

	const allowed = await authorize(user, "list", "representatives");
	if (!allowed) {
		return res.status(403).json({
			error: `User ${user} is not allowed to list representatives`,
		});
	}

	const representatives = await listRepresentatives();

	return res.status(200).json({ representatives });
};

const assign = async (req, res) => {
	const user = req.headers["x-user"];

	const { slug: [representative, toAssign] = [] } = req.query;

	const allowed = await authorize(user, "assign", `representatives`);
	if (!allowed) {
		return res.status(403).json({
			error: `User ${user} is not allowed to assign representatives`,
		});
	}

	const assigned = await assignUser(
		representative,
		"editor",
		`account:${toAssign.split("@")[0]}`
	);

	return res.status(200).json({ assigned });
};

const unassign = async (req, res) => {
	const user = req.headers["x-user"];

	const { slug: [representative, toAssign] = [] } = req.query;

	const allowed = await authorize(user, "assign", `representatives`);
	if (!allowed) {
		return res.status(403).json({
			error: `User ${user} is not allowed to unassign representatives`,
		});
	}

	const unassigned = await unassignUser(
		representative,
		"editor",
		`account:${toAssign.split("@")[0]}`
	);

	return res.status(200).json({ unassigned });
};

export default async function handler(req, res) {
	const user = req.headers["x-user"];

	const { slug: [representative] = [] } = req.query;

	if (!representative) {
		return list(req, res);
	}

	if (representative && req.method === "POST") {
		return assign(req, res);
	}

	if (representative && req.method === "DELETE") {
		return unassign(req, res);
	}
}
