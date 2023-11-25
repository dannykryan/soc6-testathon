# Testathon: The testing hackathon

Welcome to the full-stack todos app testing hackathon! Before jumping into the tasks, let's get familiar with the codebase and running the application:

1. Take time to review the codebase structure and functionality:

   - Examine the frontend code to understand how the UI works and is rendered.
   - Look through the backend API routes to see how data is handled.
   - Check the database schema and seed data to see how information is stored.
   - To deepen your understanding of any complex parts of the code, feel free to copy snippets into ChatGPT or other AI assistants and ask them to explain what the code is doing. Use their explanations of the syntax and logic to strengthen your own knowledge.

2. Set up a database server so you have a connection URL.
3. Create a `.env` file in the root of the project and add a `DATABASE_URL` variable set to your connection URL and optionally a `PORT`. See `.env.example` for reference.
4. Install dependencies with `npm install`.
5. Initialise the database by running `npm run db-reset`. This will create the necessary tables with necessary data.
6. Start the app with `npm run dev`. This launches the Express server which handles the API and serves the frontend.
7. Open the URL printed in the terminal in your browser. You should see the todo app frontend. Play with it from a user perspective.
8. Now that you're familiar with the code and running the app, you're ready to begin the testing tasks!

### API testing

Writing integration tests that are focused on the backend and database can help narrow down quicker whether any failing tests are specifically due to the backend.

Write API tests (using Vitest and Supertest).

- After installing Vitest, you can create a `vitest.config.js` at the root of the project. This tells Vitest to run the `dotenv` package (which will add information from the `.env` file to global `process.env` object). If this step is missing, environment variables won't get loaded and your Express app won't be able to connect to the right database.

  ```js
  // This is the vitest.config.js file
  import { defineConfig } from "vitest/config";

  export default defineConfig({
    test: {
      setupFiles: ["dotenv/config"],
    },
  });
  ```

- At the start of each test, reset the todos table to a known initial state programmatically to improve test isolation. This ensures a clean slate before making any changes or assertions, and prevents tests interfering with each other when run sequentially. The `resetAllTables` function provided in `db/helper.js` can handle resetting the database. An example of usage can be seen in `db/scripts/reset-all-tables.js`.
- Stretch goal: After all tests complete, cleanly shut down the database connection pool using a Vitest `afterAll` hook. This ensures all connections close properly once the test run finishes.

Your API tests should cover the scenarios below:

| 1. Getting all todos |                                                         |
| -------------------- | ------------------------------------------------------- |
| Endpoint             | GET /api/todos                                          |
| Response body        | { success: true, payload: an array of todo objects }    |
| Response status      | 200                                                     |
| Response header      | `Content-Type` header should contain `application/json` |

| 2. Creating a todo |                                                         |
| ------------------ | ------------------------------------------------------- |
| Endpoint           | POST /api/todos                                         |
| Request body       | { task: string, completionDate: string }                |
| Request header     | `Content-Type` header should contain `application/json` |
| Response body      | { success: true, payload: newly created todo object }   |
| Response status    | 201                                                     |
| Response header    | `Content-Type` header should contain `application/json` |

| 3. Deleting a todo |                                                         |
| ------------------ | ------------------------------------------------------- |
| Endpoint           | DELETE /api/todos/some_id                               |
| Response body      | { success: true, payload: deleted todo object }         |
| Response status    | 200                                                     |
| Response header    | `Content-Type` header should contain `application/json` |

| 4. Invalid request |                                                                           |
| ------------------ | ------------------------------------------------------------------------- |
| Endpoint           | POST /api/todos                                                           |
| Request body       | Missing/invalid request body (for example, empty object)                  |
| Request header     | `Content-Type` header should contain `application/json`                   |
| Response body      | { success: false, error: "Please provide a 'task' and 'completionDate'" } |
| Response status    | 400                                                                       |
| Response header    | `Content-Type` header should contain `application/json`                   |

| 5. Invalid request |                                                                   |
| ------------------ | ----------------------------------------------------------------- |
| Endpoint           | DELETE /api/todos/NONEXISTENT_ID                                  |
| Response body      | { success: false, error: "No todo with id NONEXISTENT_ID found" } |
| Response status    | 404                                                               |
| Response header    | `Content-Type` header should contain `application/json`           |

### End-to-end testing

Let's practice end-to-end testing with Playwright! First, install Playwright following the docs: https://playwright.dev/docs/intro

Since your API tests and your end-to-end tests will likely use the same database instance, it'll be useful to reset the database back to a known initial state. You can do this at the start of your end-to-end test with the `resetAllTables` function that you used in your API tests.

Next, write a test that covers this user flow:

1. User visits the todo app website
2. User adds a couple todos to the list
3. User deletes one of the added todos
4. User refreshes the page
5. The remaining todos are still visible on the page

For each step:

- Use Playwright to simulate user actions like clicking buttons, typing text, etc.
- Add assertions to validate the expected UI state. For example, ensure the correct todos appear after adding/deleting.
- Feel free to modify the HTML or JavaScript code (if needed) to make the UI easier to test from an accessibility perspective.
- Check https://www.w3.org/TR/html-aria/#docconformance if you need help figuring out which role value to use with `getByRole()` selectors.

# Stretch Goals 🌟

If you have time, challenge yourselves by tackling the following stretch goals:

- Stretch Goal 1: Iteratively add new features
  - This could include things like updating todos, more todo details, or multiple todo lists per user
- Stretch Goal 2: Refactor
  - Consider refactoring parts of the codebase that could be simplified or made more readable. Refactoring with existing tests in place gives you confidence that you're not breaking existing features.
- Stretch Goal 3: Write unit tests for areas of the codebase where focused, isolated tests validating functionality would enable confident refactoring and new feature development.

For any changes you make:

- Plan out the implementation and think through potential edge cases.
- Write additional tests validating the new functionality works as expected. Expand test coverage with each new feature.
- Frequently rerun the full test suite after changes to immediately catch any regressions.

The goal is to incrementally improve the codebase quality and expand the app's capabilities by leveraging tests.
