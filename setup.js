const { Permit } = require("permitio");
require("dotenv").config();
const PERMIT_SDK_KEY = process.env.PERMIT_TOKEN;

const appUsers = [
  {
    email: "harry@potter.io",
    first_name: "Harry",
    last_name: "Potter",
  },
  {
    email: "hermione@granger.app",
    first_name: "Hermione",
    last_name: "Granger",
  },
  {
    email: "ron@weasley.me",
    first_name: "Ron",
    last_name: "Weasley",
  },
];

const employees = [
  {
    email: "albus@pink.mobile",
    first_name: "Albus",
    last_name: "Dumbledore",
  },
  {
    email: "sirius@pink.mobile",
    first_name: "Sirius",
    last_name: "Black",
  },
  {
    email: "luna@pink.mobile",
    first_name: "Luna",
    last_name: "Lovegood",
  },
];

const permit = new Permit({
  token: PERMIT_SDK_KEY,
});

const resources = async () => {
  await permit.api.resources.create({
    key: "representatives",
    name: "Representatives",
    actions: {
      list: {
        name: "List",
      },
      assign: {
        name: "Assign",
      },
    },
  });
  await permit.api.resources.create({
    key: "users",
    name: "Users",
    actions: {
      list: {
        name: "List",
      },
      create: {
        name: "Create",
      },
    },
  });
  await permit.api.resources.create({
    key: "account",
    name: "Account",
    actions: {
      manage: {
        name: "Manage",
      },
      view: {
        name: "View",
      },
    },
    roles: {
      owner: {
        name: "Owner",
        permissions: ["view", "manage"],
      },
      editor: {
        name: "Editor",
        permissions: ["view"],
      },
      member: {
        name: "Member",
        permissions: ["view"],
      },
    },
  });
  await permit.api.resources.create({
    key: "plan",
    name: "Plan",
    actions: {
      change: {
        name: "Change",
      },
      view: {
        name: "View",
      },
    },
    attributes: {
      owner: { type: "string" },
    },
    roles: {
      editor: {
        name: "Editor",
        permissions: ["view", "change"],
        granted_to: {
          users_with_role: [
            {
              role: "editor",
              on_resource: "account",
              linked_by_relation: "parent",
            },
          ],
        },
      },
    },
    relations: {
      parent: "account",
    },
  });
};

const roles = async () => {
  await permit.api.roles.create({
    key: "manager",
    name: "Manager",
    permissions: [
      "representatives:assign",
      "account:view",
      "users:create",
      "representatives:list",
      "plan:view",
      "users:list",
    ],
  });
  await permit.api.roles.create({
    key: "representative",
    name: "Representative",
    permissions: ["users:list"],
  });
};

const conditionSets = async () => {
  const { project_id: projectId, environment_id: environmentId } = await fetch(
    "https://api.permit.io/v2/api-key/scope",
    {
      headers: {
        Authorization: `Bearer ${PERMIT_SDK_KEY}`,
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json());

  await fetch(
    `https://api.permit.io/v2/schema/${projectId}/${environmentId}/users/attributes`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PERMIT_SDK_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: "blocked",
        type: "bool",
      }),
    }
  ).then((res) => res.json());

  await permit.api.conditionSets.create({
    key: "blocked_users",
    name: "Blocked Users",
    type: "userset",
    conditions: {
      allOf: [{ allOf: [{ "user.blocked": { equals: true } }] }],
    },
  });
  await permit.api.conditionSets.create({
    key: "active_users",
    name: "Active Users",
    type: "userset",
    conditions: {
      allOf: [{ allOf: [{ "user.blocked": { equals: false } }] }],
    },
  });
  await permit.api.conditionSets.create({
    key: "owned_plans",
    name: "Owned Plans",
    type: "resourceset",
    resource_id: "plan",
    conditions: {
      allOf: [
        { allOf: [{ "resource.owner": { equals: { ref: "user.key" } } }] },
      ],
    },
  });
  await permit.api.conditionSetRules.create({
    user_set: "active_users",
    resource_set: "owned_plans",
    permission: "plan:view",
  });
  await permit.api.conditionSetRules.create({
    user_set: "active_users",
    resource_set: "owned_plans",
    permission: "plan:change",
  });
  await permit.api.conditionSetRules.create({
    user_set: "blocked_users",
    resource_set: "owned_plans",
    permission: "plan:view",
  });
};

const users = async () => {
  await Promise.all(
    appUsers.concat(employees).map(({ email, first_name, last_name }) =>
      permit.api.users.sync({
        email,
        key: email,
        first_name,
        last_name,
        attributes: {
          blocked: email.indexOf("ron") === 0 ? true : false,
          plan: email.indexOf("ron") === 0 ? "Standard" : "VIP",
        },
      })
    )
  );
  await Promise.all(
    appUsers.map(({ email }) =>
      permit.api.roleAssignments.assign({
        role: "owner",
        resource_instance: `account:${email.split("@")[0]}`,
        user: email,
        tenant: "default",
      })
    )
  );
  await Promise.all(
    appUsers.map(({ email }) =>
      permit.api.resourceInstances.create({
        resource: "plan",
        key: email.split("@")[0],
        tenant: "default",
      })
    )
  );
  await permit.api.roleAssignments.bulkAssign(
    ["sirius@pink.mobile", "luna@pink.mobile"].map((email) => ({
      role: "representative",
      user: email,
      tenant: "default",
    }))
  );
  await permit.api.roleAssignments.assign({
    role: "manager",
    user: "albus@pink.mobile",
    tenant: "default",
  });
  await permit.api.roleAssignments.assign({
    role: "editor",
    resource_instance: "account:harry",
    user: "sirius@pink.mobile",
  });
  await permit.api.roleAssignments.assign({
    role: "editor",
    resource_instance: "account:ron",
    user: "luna@pink.mobile",
  });
  await permit.api.roleAssignments.assign({
    role: "member",
    user: "hermione@granger.app",
    resource_instance: "account:harry",
  });
  await permit.api.roleAssignments.unassign({
    role: "owner",
    user: "hermione@granger.app",
    resource_instance: "account:hermione",
    tenant: "default",
  });
  await Promise.all(
    appUsers.map(({ email }) =>
      permit.api.relationshipTuples.create({
        subject: `account:${email.split("@")[0]}`,
        object: `plan:${email.split("@")[0]}`,
        relation: "parent",
        tenant: "default",
      })
    )
  );
};

(async () => {
  await resources();
  console.log("Resources created");
  await roles();
  console.log("Roles created");
  await conditionSets();
  console.log("Condition sets created");
})();
