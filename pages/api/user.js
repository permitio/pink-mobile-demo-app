import { authorize, listUsers } from "../../lib/authorizer";

export default async function handler(req, res) {
    const user = req.headers["x-user"];

    const allowed = await authorize(user, "list", "users");
    if (!allowed) {
        return res.status(403).json({
            error: `User ${user} is not allowed to list users`,
        });
    }

    console.log('new feature');

    const users = await listUsers();

    return res.status(200).json(users);
}
