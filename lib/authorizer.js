import { Permit } from "permitio";
const { PDP_URL, PERMIT_TOKEN } = process.env;

const permit = new Permit({
  token: PERMIT_TOKEN,
  pdp: PDP_URL,
});

export const authorize = async (user, action, resource) => {
  return permit.check(user, action, resource);
};


export const getUser = async (id) => {
  return permit.api.users.getById(id);
};



export const setUserAttributes = async (id, attributes) => {
  return permit.api.users.update(id, { attributes });
};

export const listUsers = async () => {
  const owners = await permit.api.roleAssignments.list({
    tenant: "default",
    role: "owner",
  });

  const members = await permit.api.roleAssignments.list({
    tenant: "default",
    role: "member",
  });

  const users = await Promise.all(
    [...owners, ...members].map(({ user }) => getUser(user))
  );

  return users;
};

export const assignUser = async (user, role, resource) => {
    return permit.api.roleAssignments.assign({
        user,
        role,
        resource_instance: resource,
        tenant: "default",
    });
};

export const unassignUser = async (user, role, resource) => {
    return permit.api.roleAssignments.unassign({
        user,
        role,
        resource_instance: resource,
        tenant: "default",
    });
}

export const listRepresentatives = async () => {
  console.log("listRepresentatives");
  console.log(PERMIT_TOKEN, PDP_URL)
  const assignedRepresentatives = await permit.api.roleAssignments.list({
    tenant: "default",
    role: "representative",
  });

  const representatives = await Promise.all(
    assignedRepresentatives?.map(({ user }) => getUser(user))
  );

  const roles = await Promise.all(
    representatives?.map(({ key: user }) =>
      permit.api.roleAssignments.list({ user, role: "editor" })
    )
  );

  for (const i in representatives) {
    const owners = await Promise.all(
      roles[i].map(({ resource_instance: resourceInstance }) =>
        permit.api.roleAssignments.list({ resourceInstance, role: "owner" })
      )
    );
    representatives[i].users = await Promise.all(owners.flat().map(({ user }) => getUser(user)));
  }

  return representatives;
};
