import { Todo } from "./types";
import { v4 as uuid } from "uuid";

export const initTodos: Todo[] = [
    {
        id: uuid(),
        name: "Task 1",
        isDone: false,
        priority: 1,
        deadline: new Date("2024-12-31-23-59"),
        isPinned: false,
    },
    {
        id: uuid(),
        name: "Task 2",
        isDone: true,
        priority: 2,
        deadline: new Date("2024-11-30-23-59"),
        isPinned: false,
    },
    {
        id: uuid(),
        name: "Task 3",
        isDone: false,
        priority: 3,
        deadline: null,
        isPinned: true,
    }
];

export default initTodos;