# Pink Mobile

Pink Mobile is a simple mobile plan management application that demonstrates the basic principles of fine-grained authorization using Permit.io.

Pink Mobile utilize the RBAC, ReBAC, ABAC models and use impersonation of three different user personas: Customer, Representative, and Manager to demonstrates how each user gets only the proper permissions for them.

TBD add a screenshot of the three screens

The app is built with Next.js and uses the free-tier of the Permit.io authorization service to manage permissions.

## Run the Application

> If you prefer to use a hosted version of the application, you can access it [here](https://pink-mobile-demo-app.vercel.app/) TBD change the link.

### Prerequisites

- Node.js (for the application itself)
- Docker (for the Permit.io local policy engine)
- A free account in Permit.io (for permissions management)

### Installation

1. Clone the repository, and install the dependencies by running
   ```
   npm install
   ```
2. Open an account in Permit.io and copy your API key to the `.env` file in the following format:
   ```
   PERMIT_TOKEN=your-api-key
   ```
3. From a terminal window in the root of the project, setup your new Permit.io environment by running the following command:
   ```
   node setup
   ```
4. Run the local Permit.io decision point (PDP) as a docker container by running the following command:
   ```
   docker run -p 7766:7000 --env PDP_API_KEY=<your-api-key> --env PDP_DEBUG=true permitio/pdp-v2:latest
   ```
5. Run the application by running the following command:
   ```
   npm run dev
   ```

After you performed this steps, you'll be able to browse to the application at[http://localhost:3000](http://localhost:3000) and impersonate the roles by using the different tabs.

## Test the Application

The application consist three tabs, each of them represent a different type of user פקרדםמשד that could perform different operations.

1. **Manager** - admins that manage agents (representatives) and can assign customers to them so they can manage their plans.
2. **Representative** - agents that can manage the customers and their plans. Here, the permissions is using relationships between agent and their customers to check what they are allowed to do.
3. **Customer** - end users that can manage their own plans only in case they have the proper permissions for that.

> To simplify the application code, we haven't implemented proper authentication. Instead of verifying user identities, we are using user inputs to impersonate various users. <br> [Learn more about the difference between authentication and authorization](https://permit.io/blog/authentication-vs-authorization).

### Representative Permissions flow

To demonstrate the flexiablity and granularity of the permissions in the application, let's start from the representative tab. As you can see we can manage in the following flows:

- **Happy path**

  _A representative is choosing a user they are allowed to manage, and can perform a plan change._

  To test that, choose the `Sirius Black` as a representative, and `Harry Potter` as a customer. You can see that the `Change Plan` button is enabled, and you can change the plan.

- **Unassign representative**

  _A representative is not allowed to view the plan for a customer they are not assigned to._

  To test that, try to change the plan for `Ron Weasley`, you'll see that the `Change Plan` operation is returning an error, as the representative is not assigned to this customer.

- **Unallowed operation**

  _A representative prevented to perform an operation on a customer without proper permissions._

  To test that, try to view the plan for `Hermione Granger`, you'll get an error. The reason is that Hermione is not an owner of a plan, but only a member of Harry plan.

- **Blocked user**

  _A representative is not allowed to perform an operation on a blocked user._

  To test that, try to change the representative to `Luna Lovegood`, and change Ron's plan, you'll see that although Luna is assigned to Ron, she is blocked from performing any operation on Ron's plan as Ron is blocked on the system.

The following diagram shows the various permission checks that are performed in the representative flow:
TBD add the representative flow diagram

### Dynamic Policy Changes

To test dynamic policy change, let's go to the Manager screen, and assign Ron's user to `Sirius Black` by adding their email `ron@weasley.me` to `Sirius` list.
After you performed this change, you can go back to the representative tab, and see that now Sirius is allowed change Ron's plan (although Ron his block, so it won't be possible to change the plan).

### Customer Permissions flow

With the same policy model, but impersonating the customer, you can see that the customer can only manage their own plan, and not the plans of other customers.
You can also see that if you'll impersonate `Hermione Granger`, you'll see that she can't manage her own plan, as she is not the owner of the plan, but only a member of Harry's plan.

## Learn More
To learn more on the way we modeld the permissions in the application, you can read the following blog documentation that explains the way we modeled the permissions in the application: TBD add the link to the blog post.

