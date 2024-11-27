import { useState, useEffect } from "react";
import { Todo } from "./types";
import { initTodos } from "./initTodos";
import WelcomeMessage from "./WelcomeMessage";
import TodoList from "./TodoList";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge"; // ◀◀ 追加
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // ◀◀ 追加
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"; // ◀◀ 追加

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState(3);
  const [newTodoDeadline, setNewTodoDeadline] = useState<Date | null>(null);
  const [newTodoNameError, setNewTodoNameError] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [showNewTaskPrompt, setShowNewTaskPrompt] = useState(false);
  const localStorageKey = "TodoApp";
  const lastAccessKey = "LastAccess";
  const [isEditing, setIsEditing] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleEditClose = () => {
    setIsEditing(false);
    setEditingTodo(null);
  };

  const saveEditedTodo = (updatedTodo: Todo) => {
    setTodos((prevTodos) => prevTodos.map((todo) => todo.id === updatedTodo.id ? updatedTodo : todo)
    );
    handleEditClose();
  };

  useEffect(() => {
    const now = dayjs();

    const lastAccessStr = localStorage.getItem(lastAccessKey);
    if (lastAccessStr) {
      const lastAccess = dayjs(lastAccessStr);

      if (!lastAccess.isSame(now, "day")) {
        setShowNewTaskPrompt(true);
      }

      // if (now.diff(lastAccess, "minute") >= 1) {
      //   setShowNewTaskPrompt(true);
      // }
    }

    localStorage.setItem(lastAccessKey, now.toISOString());

    const todoJsonStr = localStorage.getItem(localStorageKey);
    if (todoJsonStr && todoJsonStr !== "[]") {
      const storedTodos: Todo[] = JSON.parse(todoJsonStr);
      const convertedTodos = storedTodos.map((todo) => ({
        ...todo,
        deadline: todo.deadline ? new Date(todo.deadline) : null,
      }));
      setTodos(convertedTodos);
    } else {
      setTodos(initTodos);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem(localStorageKey, JSON.stringify(todos));
    }
  }, [todos, initialized]);

  const handlePromptClose = () => {
    setShowNewTaskPrompt(false);
  };

  const updateIsDone = (id: string, value: boolean) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isDone: value };
      } else {
        return todo;
      }
    });
    setTodos(updatedTodos);
  };

  const removeCompletedTodos = () => {
    const updatedTodos = todos.filter((todo) => !todo.isDone);
    setTodos(updatedTodos);
  }

  const removeTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }

  const uncompletedCount = todos.filter((todo: Todo) => !todo.isDone).length;

  // ▼▼ 追加
  const isValidTodoName = (name: string): string => {
    if (name.length < 2 || name.length > 32) {
      return "2文字以上、32文字以内で入力してください";
    } else {
      return "";
    }
  };

  const updateNewTodoName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoNameError(isValidTodoName(e.target.value)); // ◀◀ 追加
    setNewTodoName(e.target.value);
  };

  const updateNewTodoPriority = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoPriority(Number(e.target.value));
  };

  const updateDeadline = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dt = e.target.value; // UIで日時が未設定のときは空文字列 "" が dt に格納される
    console.log(`UI操作で日時が "${dt}" (${typeof dt}型) に変更されました。`);
    setNewTodoDeadline(dt === "" ? null : new Date(dt));
  };

  const addNewTodo = () => {
    // ▼▼ 編集
    const err = isValidTodoName(newTodoName);
    if (err !== "") {
      setNewTodoNameError(err);
      return;
    }
    const newTodo: Todo = {
      id: uuid(),
      name: newTodoName,
      isDone: false,
      priority: newTodoPriority,
      deadline: newTodoDeadline,
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    setNewTodoName("");
    setNewTodoPriority(3);
    setNewTodoDeadline(null);
  };

  return (
    <div className={twMerge("mx-4 mt-10 max-w-2xl md:mx-auto", showNewTaskPrompt && "pointer-events-none")}>
      <h1 className="mb-4 text-2xl font-bold">TodoApp</h1>
      <div className="mb-4">
        <WelcomeMessage
          name="あなた"
          uncompletedCount={uncompletedCount}
        />
      </div>


      <div className="mt-5 mb-2 space-y-2 rounded-md border p-3">
        <h2 className="text-lg font-bold">新しいタスクの追加</h2>
        {/* 編集: ここから... */}
        <div>
          <div className="flex items-center space-x-2">
            <label className="font-bold" htmlFor="newTodoName">
              名前
            </label>
            <input
              id="newTodoName"
              type="text"
              value={newTodoName}
              onChange={updateNewTodoName}
              className={twMerge(
                "grow rounded-md border p-2",
                newTodoNameError && "border-red-500 outline-red-500"
              )}
              placeholder="2文字以上、32文字以内で入力してください"
            />
          </div>
          {newTodoNameError && (
            <div className="ml-10 flex items-center space-x-1 text-sm font-bold text-red-500 ">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="mr-0.5"
              />
              <div>{newTodoNameError}</div>
            </div>
          )}
        </div>
        {/* ...ここまで */}

        <div className="flex gap-5">
          <div className="font-bold">優先度</div>
          {[1, 2, 3].map((value) => (
            <label key={value} className="flex items-center space-x-1">
              <input
                id={`priority-${value}`}
                name="priorityGroup"
                type="radio"
                value={value}
                checked={newTodoPriority === value}
                onChange={updateNewTodoPriority}
              />
              <span>{value}</span>
            </label>
          ))}
        </div>

        <div className="flex items-center gap-x-2">
          <label htmlFor="deadline" className="font-bold">
            期限
          </label>
          <input
            type="datetime-local"
            id="deadline"
            value={
              newTodoDeadline
                ? dayjs(newTodoDeadline).format("YYYY-MM-DDTHH:mm:ss")
                : ""
            }
            onChange={updateDeadline}
            className="rounded-md border border-gray-400 px-2 py-0.5"
          />
        </div>

        <button
          type="button"
          onClick={addNewTodo}
          className={twMerge(
            "rounded-md bg-indigo-500 px-3 py-1 font-bold text-white hover:bg-indigo-600",
            (!!newTodoNameError || newTodoName === "") && "cursor-not-allowed opacity-50"
          )}
        >
          追加
        </button>
      </div>





      {isEditing && editingTodo && (
        <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
          <div className="z-60 rounded-lg bg-white p-6 shadow-lg pointer-events-auto">
            <h2 className="mb-4 text-lg font-bold">タスクを編集</h2>
            <div>
              <label className="block">名前</label>
              <input
                type="text"
                value={editingTodo.name}
                onChange={(e) =>
                  setEditingTodo({ ...editingTodo, name: e.target.value })
                }
                className="mb-4 w-full rounded-md border p-2"
                placeholder="タスク名"
                />
            </div>

            <div>
              <label className="block">優先度</label>
              <select
                value={editingTodo.priority}
                onChange={(e) =>
                  setEditingTodo({...editingTodo, priority: parseInt(e.target.value) })
                }
                className="mb-4 w-full rounded-md border p-2"
              >
                {[1, 2, 3].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block">期限</label>
            <input
              type="datetime-local"
              value={editingTodo.deadline ? dayjs(editingTodo.deadline).format("YYYY-MM-DD HH:mm") : ""}
              onChange={(e) => setEditingTodo({ ...editingTodo, deadline: new Date(e.target.value) })}
              className="border p-2 rounded-md"
              />
            </div>
            <button
              onClick={() => saveEditedTodo(editingTodo)}
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 mr-2"
            >
              保存
            </button>
            <button
              onClick={handleEditClose}
              className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}


      {showNewTaskPrompt && (
        <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
          <div className="z-60 rounded-lg bg-white p-6 shadow-lg pointer-events-auto">
            <p className="mb-4 text-lg font-bold">
              前回アクセスから1日が経過しました<br/>新しいタスクはありませんか？
            </p>
            <button
              onClick={handlePromptClose}
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      
      <TodoList
        todos={todos}
        updateIsDone={updateIsDone}
        remove={removeTodo}
        edit={(todo) => {
          setIsEditing(true);
          setEditingTodo(todo);
        }}
      />


      <button
        type="button"
        onClick={removeCompletedTodos}
        className={"mt-5 rounded-md bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-600"}
      >
        完了済みのタスクを削除
      </button>
    </div>
  );
};

export default App;