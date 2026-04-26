Although register logic exists in code, the authentication route is not accessible through the application UI, so user registration cannot be tested or verified.
The login page returns a 404 error due to broken routing, preventing authentication from being executed or validated.
Quantity update logic exists in Firestore operations, but due to authentication and routing issues, cart behavior cannot be consistently validated through the UI. Parial marks are awarded for implementation attempt, but expected interactive behavior is not reliably demonstrated.
Add and remove cart operations are written in code, but broken navigation and login flow prevent proper end-to-end verification. The cart workflow does not match the expected application behavior, so only partial credit is justified.
Product fetching is visible on the home page, but order fetching cannot be consistently verified due to authentication flow failure. Since all required pages must demonstrate working Firestore reads, this requirement is only partially satisfied.
Context is implemented in code but broken routing prevents full demonstration of authentication and cart state behavior.
Async product loading exists but expected behavior is only partially demonstrated compared to benchmark output.
Although a useEffect hook exists in the product context to fetch products from an external API, the expected application behavior shown in the benchmark video is not fully reproduced in the student's UI. The side-effect is not demonstrated reliably through the running application flow, and the observable output does not match the expected loading and product lifecycle behavior. Since grading is based on functional demonstration rather than code presence alone, the requirement is considered not fulfilled.
The authentication side-effect using onAuthStateChanged is present in the code; however, the authentication flow is broken in the userr interface due to routing errors that return a 404 page. As a result, automatic authentication persistence cannot be demonstrated or validated in the running application. Since this requirement evaluates observable behavior, not theoretical implementation, the authentication side-effect is treated as non-functional.
Routes are declared in code but are not functioning correctly in the running application. Navigation to /signIn and other pages results in a 404 error, which proves the routing configuration is broken. Since routes cannot be accessed through the UI, the requirement is considered not implemented in a functional sense. Code issue reference Children: [React Router requires: children: [Wrong key -> routes never mount -> 404 error UI proof: login route unreachable]]
NavLink and useNavigate are imported and used in components, but due to incorrect router configuration, these hooks cannot operate correctly in the live application. While syntax usage exists in the code, routing behavior is unreliable and does not match expected navigation flow. Minimal partial credit is given for attempt, not functionality.
Authentication-based redirection is not implemented. Users are not automatically redirected after login/signup, and route protection is missing. Additionally, the 404 page appears even for valid routes due to broken routing structure. This indicates routing guards and fallback handling are incorrect.

The firebase API would look like this:
/products to store the products
/usersCarts/<user_uid>/myCart to keep the cart products and their quantity
/userOrders/<user_uid>/orders to hold users orders

use action.payload instead of action.error.message.
