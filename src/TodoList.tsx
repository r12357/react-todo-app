import React from "react";
import { Todo } from "./types";
import TodoItem from "./TodoItem";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCross
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";


type Props = {
  todos: Todo[];
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
  edit: (todo: Todo) => void;
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
            edit = {props.edit}
          />
        
          {/* 完了済み表示 */}
          {todo.isDone && (
            <span className="rounded mb-1">
              [完了済み]
            </span>
          )}
          
          {/* task名 */}
          <span className={twMerge("mr-2", todo.isDone && "line-through text-gray-400")}>
            {todo.name}
          </span>
            

          {/* 優先度 */}
          <span className="ml-2">
          優先度
          </span>
          <span className="ml-2 text-orange-400">
            {yuusendo_cross(todo.priority)}
          </span>
          
          {/* 期限表示 */}
          <div className="text-sm text-gray-500">
            期限:{" "}
            {todo.deadline ? dayjs(todo.deadline).format("YYYY/MM/DD HH:mm") : "期限なし"}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoList;

