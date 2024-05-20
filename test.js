const { Permit } = require("permitio");
const assert = require("node:assert");
require("dotenv").config();

const PERMIT_SDK_KEY = process.env.PERMIT_TOKEN;

const permit = new Permit({
  token: PERMIT_SDK_KEY,
});

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
  try {
    await users();
    console.log("Mock users created");
  } catch(e) {}
  const allowed = await permit.check(
    "albus@pink.mobile",
    "list",
    "representatives"
  );
})();
