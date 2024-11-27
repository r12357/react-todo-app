import React from "react";
import { Todo } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";


type Props = {
    todo: Todo;
    updateIsDone: (id: string, value: boolean) => void;
    remove: (id: string) => void;
    edit: (todo: Todo) => void;
    togglePin: (id: string) => void;
};

const TodoItem = (props: Props) => {
    const todo = props.todo;
    return (
        <div className="flex items-conter justify-between">
            <div className="flex items-center">
                <FontAwesomeIcon
                    icon={faThumbtack}
                    className={`cursor-pointer mr-2 ${todo.isPinned ? "text-black" : "text-gray-400"}`}
                    onClick={() => props.togglePin(todo.id)}
                />
                <input
                    type="checkbox"
                    checked={todo.isDone}
                    onChange={(e) => props.updateIsDone(todo.id, e.target.checked)}
                    className="mr-1.5 cursor-pointer"
                />
                {todo.isDone && (
                    <span className="rounded mb-1">
                    [完了済み]
                    </span>
                )}
                <span className={twMerge("mr-2 text-lg", todo.isDone && "line-through text-gray-400")}>
                    {todo.name}
                </span>
            </div>
            <div className="flex flex-col items-end">
                <button
                    onClick={() => props.remove(todo.id)}
                    className="rounded-md bg-slate-200 px-2 py-1 text-sm font-bold text-white hover:bg-red-500">
                    削除
                </button>
                <button
                    onClick={() => props.edit(todo)}
                    className="mt-1 rounded-md bg-blue-500 px-2 py-1 text-sm font-bold text-white hover:bg-blue-600">
                    編集
                </button>
            </div>
        </div>
    );
};

export default TodoItem;