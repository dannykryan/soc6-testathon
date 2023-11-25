// import supertest functionality
import request from "supertest";

// import test functions from vitest
import { test, expect } from "vitest";

// import the Express app from app.js (because it needs to be tested)
import app from "../app.js";

import { resetAllTables } from "../db/helpers.js";

import { todosApiEndpoint } from "../public/js/todos-api.js";

import { seedData } from "../db/seedData.js"

test("GET /api/todo", async () => {
  // reset db to test on clean slate
  await resetAllTables(seedData);
  // define endpoint to test along with request type
  const response = await request(app).get(todosApiEndpoint);

  //      assert that the response body is an object
  expect(response.body).toMatchObject({
    success: true,
    payload: [
      {
        completion_date: "1999-01-08T00:00:00.000Z",
        id: 1,
        task: "Walk the dog",
      },
      {
        completion_date: "2015-01-10T00:00:00.000Z",
        id: 2,
        task: "Feed the computer",
      },
    ],
  });
  //assert status code of response
  expect(response.status).toBe(200);
  //assert response header is Content-Type header should contain application/json
  expect(response.header["content-type"]).toContain("application/json");
});

test(" DELETE /api/todo", async () => {
  // reset db to test on clean slate
  await resetAllTables(seedData);
  // define endpoint to test along with request type
  const response = await request(app).delete(`${todosApiEndpoint}/1`);
  // assert response body structure
  expect(response.body).toMatchObject({
    success: true,
    payload: {
      completion_date: "1999-01-08T00:00:00.000Z",
      id: 1,
      task: "Walk the dog",
    },
  });
  //assert status code of response
  expect(response.status).toBe(200);
  //assert response header is Content-Type header should contain application/json
  expect(response.header["content-type"]).toContain("application/json");
});

//DELETE /api/todos/NONEXISTENT_ID
test(" DELETE /api/todo/nonexisting id", async () => {
  // reset db to test on clean slate
  await resetAllTables(seedData);
  // define endpoint to test along with request type
  const response = await request(app).delete(`${todosApiEndpoint}/123`);
  // assert response body structure
  expect(response.body).toMatchObject({
    success: false,
    error: "No todo with id 123 found",
  });
  //assert status code of response
  expect(response.status).toBe(404);
  //assert response header is Content-Type header should contain application/json
  expect(response.header["content-type"]).toContain("application/json");
});

test("POST /api/todos", async function () {
    await resetAllTables(seedData);
    const response = await request(app)
    .post(todosApiEndpoint)
    .send({ task: "Pet the cat", completionDate: "2023-10-10" })
    .set("Content-Type", "application/json");
  expect(response.body).toMatchObject({
    success: true,
    payload: {
      id: 3,
      task: "Pet the cat",
      completion_date: "2023-10-10T00:00:00.000Z",
    },
  });
  expect(response.status).toBe(201);
  expect(response.header["content-type"]).toContain("application/json");
  await resetAllTables(seedData);
});

test("POST /api/todos", async function () {
  const response = await request(app)
    .post(todosApiEndpoint)
    .send({})
    .set("Content-Type", "application/json");
  expect(response.body).toMatchObject({
    success: false,
    error: "Please provide a 'task' and 'completionDate'",
  });
  expect(response.status).toBe(400);
  expect(response.header["content-type"]).toContain("application/json");
});
