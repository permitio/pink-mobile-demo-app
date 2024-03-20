# Pink Mobile

Pink Mobile is a simple mobile plan management application that demonstrates the basic principles of fine-grained authorization using Permit.io.

Pink Mobile utilizes the RBAC, ReBAC, and ABAC models. It uses impersonation of three different user personas: Customer, Representative, and Manager, to demonstrate how each user gets only the proper permissions.

![screenshots](https://github.com/permitio/pink-mobile-demo-app/assets/4082578/6ee09c6c-8c2d-4ead-a739-d628917aa598)

The app is built with Next.js and uses the free-tier of the Permit.io authorization service to manage permissions.

## Run the Application

> [!NOTE]
> If you prefer to use a hosted version of the application, you can access it [here](https://pink-mobile.up.railway.app/)

### Prerequisites

- [Node.js](https://nodejs.org/en) for the application itself
- [Docker](https://docs.docker.com/engine/install/) (for the Permit's local policy engine)
- A [free account of Permit.io](https://app.permit.io) (for permissions management)

### Installation

1. Clone the repository and install the dependencies by running
   ```
   npm install
   ```
2. Paste the following variables in the `.env` file. Use [your API key](https://docs.permit.io/getting-started/connecting-your-app) from your Permit account:
   ```
   PDP_URL =http://localhost:7766
   PERMIT_TOKEN=your-api-key
   ```
3. From a terminal window in the root of the project, setup your new Permit configuration by running the following command:
   ```
   node setup
   ```
4. Run the local Permit decision point (PDP) as a docker container by running the following command:
   ```
   docker run -p 7766:7000 --env PDP_API_KEY=<your-api-key> --env PDP_DEBUG=true permitio/pdp-v2:latest
   ```
5. Run the application by running the following command:
   ```
   npm run dev
   ```

After you perform these steps, you'll be able to browse the application at[http://localhost:3000](http://localhost:3000) and impersonate the roles by using the different tabs.

## Test the Application

The application consists of three tabs, each of which represents a different type of user personas that could perform different operations.

1. **Manager** - admins that manage agents (representatives) and can assign customers to them so they can manage their plans.
2. **Representative** - agents that can manage the customers and their plans. Here, the permissions are using relationships between agent and their customers to check what they are allowed to do.
3. **Customer** - end users that can manage their own plans only in case they have the proper permissions for that.

> To simplify the application code, we haven't implemented proper authentication. Instead of verifying user identities, we are using user inputs to impersonate various users. <br> [Learn more about the difference between authentication and authorization](https://permit.io/blog/authentication-vs-authorization).

### Representative Permissions flow

To demonstrate the flexibility and granularity of the permissions in the application, let's start with the representative tab. As you can see, we can manage the following flows:

- **Happy path**

    _A representative is choosing a user they are allowed to manage and can perform a plan change._

    To test that, choose `Sirius Black` as a representative and `Harry Potter` as a customer. You can see that the `Change Plan` button is enabled, and you can change the plan.

- **Unassign representative**

    _A representative is not allowed to view the plan for a customer they are not assigned to._

    To test that, try to change the plan for `Ron Weasley`. You'll see that the `Change Plan` operation is returning an error as the representative is not assigned to this customer.

- **Unauthorized operation**

    _A representative is prevented from performing an operation on a customer without proper permissions._

    To test that, try to view the plan for `Hermione Granger` you'll get an error. The reason is that Hermione is not an owner of any plan but only a member of Harry's plan.

- **Blocked user**

    _A representative is not allowed to perform an operation on a blocked user._

    To test that, try to change the representative to `Luna Lovegood` and change Ron's plan. You'll see that although Luna is assigned to Ron, she is blocked from performing any operation on Ron's plan as Ron is blocked in the system.

The following diagram shows the various permission checks that are performed in the representative flow:
![rep_flow](https://github.com/permitio/pink-mobile-demo-app/assets/4082578/2217a080-a4a3-4387-a57b-eaa1d1d83c7e)



### Dynamic Policy Changes

To test dynamic policy changes, let's go to the Manager screen and assign Ron's user to `Sirius Black` by adding their email `ron@weasley.me` to `Sirius`'s list.
After you have made this change, you can go back to the representative tab and see that now Sirius is allowed to change Ron's plan (although Ron is blocked, so it won't be possible to change the plan).

### Customer Permissions Flow

With the same policy model, but impersonating the customer, you can see that the customer can only manage their own plan and not the plans of other customers.
You can also see that if you impersonate `Hermione Granger`, you'll see that she can't manage her own plan as she is not the owner of the plan, but only a member of Harry's plan.

## Learn More
To learn more about the way we modeled the permissions in the application, you can read the following blog documentation that explains the way we modeled the permissions in the application: https://docs.permit.io/modeling/pink-mobile
