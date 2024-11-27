import React from "react";
import { Todo } from "./types";
import TodoItem from "./TodoItem";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCross
} from "@fortawesome/free-solid-svg-icons";

type Props = {
  todos: Todo[];
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
};

const yuusendo_cross = (n: number): JSX.Element[] => {
  return Array.from({ length: n }, (_, index) => (
    <FontAwesomeIcon icon={faCross} flip="horizontal" className="mr-1" key={index} />
  ));
};

const TodoList = (props: Props) => {
  const todos = props.todos;

  if (todos.length === 0) {
    return (
      <div className="text-red-500">
        現在、登録されているタスクはありません。
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {todos.map((todo) => (
        <div key={todo.id} className={twMerge("rounded-md border border-slate-500 bg-white px-3 py-2 drop-shadow-md", todo.isDone && "bg-blue-50 opacity-50")}>

          <TodoItem
            key={todo.id}
            todo={todo}
            remove={props.remove}
            updateIsDone={props.updateIsDone}
          />
        
        {todo.isDone && (
            <div className="rounded mb-1">
              完了済み
            </div>
        )}
          {todo.name} 
          <span className="ml-2">
          優先度
          </span>
          <span className="ml-2 text-orange-400">
            {yuusendo_cross(todo.priority)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TodoList;

