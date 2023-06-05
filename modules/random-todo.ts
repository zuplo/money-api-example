import { ZuploContext, ZuploRequest } from "@zuplo/runtime";
import { Todo } from "./types"

export default async function (request: ZuploRequest, context: ZuploContext) {
  const apiResponse = await fetch("https://jsonplaceholder.typicode.com/todos");

  const todos: Todo[] = await apiResponse.json();

  const randomIndex = Math.floor(Math.random() * todos.length);
  return todos[randomIndex];
}