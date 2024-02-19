This is a mobile app demo of a Mobile application demonstrating all Permit.io permissions models (RBAC, ReBAC, ABAC) in one scenario.

To run the app:
1. Add the Permit token and local PDP URL in the `.env` file
```
PDP_URL=http://localhost:7766
PERMIT_TOKEN=<YOUR_PERMIT_SDK_TOKEN>
```
2. Run `yarn` or `npm i`
3. Run `npm run dev`

For a proper test of the scenario, you should also set the following resources, roles, and permissions in the Permit dashboard.
![image](https://github.com/permitio/pink-mobile-demo-app/assets/4082578/2e3ca9aa-0ca5-4b8f-af99-9b2d7c523be6)
![image](https://github.com/permitio/pink-mobile-demo-app/assets/4082578/ad0fcb1a-bf05-43e6-89b2-ae5abc749c28)

