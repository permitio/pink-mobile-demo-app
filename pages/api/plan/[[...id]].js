import { authorize, setUserAttributes } from "../../../lib/authorizer";

export default async function handler(req, res) {
  const user = req.headers["x-user"];
  const {
    id: [userId, plan],
  } = req.query;
  const planId = userId.split("@")[0];

  const isOwner = await authorize(user, "change", `plan:${planId}`);
  if (!isOwner) {
    return res.status(403).json({
      error: `User ${user} is not allowed to change plan for ${userId}`,
    });
  }

  const isAllowed = await authorize(userId, "change", {
    type: "plan",
    attributes: { owner: userId },
  });
  if (!isAllowed) {
    return res.status(403).json({
      error: `User ${userId} is not allowed to change plan for ${userId}`,
    });
  }

  const newPlan = await setUserAttributes(userId, {
    Plan: plan,
    blocked: false,
  });

  return res.status(200).json({ success: true });
}
