import { getUser } from "../../../lib/authorizer";
import { authorize } from "/lib/authorizer";

export default async function handler(req, res) {
  const user = req.headers["x-user"];
  const { id } = req.query;
  const account = id.split("@")[0];

  
  const isOwner = await authorize(id, "manage", `account:${account}`);
  if (!isOwner) {
    return res.status(403).json({
      error: `User ${id} is not an account owner`,
    });
  }

  const allowed = await authorize(user, "view", `account:${account}`);
  if (!allowed) {
    return res.status(403).json({
      error: `Representative ${user} is not authorized to view account ${account}`,
    });
  }

  const {
    attributes: { plan },
  } = await getUser(id);

  return res.status(200).json({ plan });
}
