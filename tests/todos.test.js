import { test, expect } from "@playwright/test";

import { resetAllTables } from "../db/helpers.js";

import { seedData } from "../db/seedData.js";

//reset all tables 



test("user loading page", async ({ page }) => {
  await resetAllTables(seedData);
  await page.goto("http://localhost:3000/");
  await expect(page.getByRole("heading", { name: "Todos!" })).toBeVisible();
});

test("enter and add", async function ({ page }) {
  await page.goto("http://localhost:3000");
  // enter a todo into the input with the "New Todo:" label
  const input = page.getByLabel("Task");
  await input.fill("Walk the PC");
  await expect(input).toHaveValue("Walk the PC");
  const inputDate = page.getByLabel("Completion date");
  await inputDate.fill("2015-01-10");
  await expect(inputDate).toHaveValue("2015-01-10");
  // click on the "Add" button to clear the input and add the todo to the list
  await page.getByRole("button", { name: "Create!" }).click();
//make date refresh and clear
await expect(inputDate).toHaveValue("");
await expect(input).toHaveValue("");

//check new addition is now in list below
const taskList = page.getByRole('list', {id: "todos"})
await expect(taskList).toHaveText(/Walk the PC/)

///2nd add a task
await input.fill("Walk the law");
  await expect(input).toHaveValue("Walk the law");
  await inputDate.fill("2023-01-10");
  await expect(inputDate).toHaveValue("2023-01-10");
  // click on the "Add" button to clear the input and add the todo to the list
  await page.getByRole("button", { name: "Create!" }).click();
//make date refresh and clear
await expect(inputDate).toHaveValue("");
await expect(input).toHaveValue("");

//check new addition is now in list below
await expect(taskList).toHaveText(/Walk the law/)
});

//testing user deleting a task
test("delete task from the list", async function ({ page }) {
  await page.goto("http://localhost:3000");
const deleteButton = page.getByRole('listitem').filter({ hasText: 'Walk the dog1999-01-08🗑️' }).getByLabel('Delete this todo');
const taskList = page.getByRole('list', {id: "todos"});
await deleteButton.click();
await expect(taskList).not.toHaveText(/dog/)

});
