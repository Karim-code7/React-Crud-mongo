import axios from "axios";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";

const TodoItem = ({ todos, setTodos }) => {
  const [filter, setFilter] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [values, setValues] = useState("");
  const [selectedTodoId, setSelectedTodoId] = useState(null);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed === true;
    return true;
  });

  const handelUbdate = (todo) => {
    setSelectedTodoId(todo._id);
    setValues(todo.title);
    setOpenModal(true);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleUpdateTodo = async () => {
    try {
      await axios.patch(`/api/updatelist/${selectedTodoId}`, {
        title: values,
      });

      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === selectedTodoId ? { ...todo, title: values } : todo,
        ),
      );

      setOpenModal(false);
      setValues("");
      setSelectedTodoId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/deletlist/${id}`);

      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="">
      <div>
        {filteredTodos.map((todo) => (
          <div
            key={todo._id}
            className="  flex justify-between items-center p-4 border-b border-gray-300 last:border-none  "
          >
            <div className=" flex items-center gap-4">
              <button
                onClick={() => toggleTodo(todo._id)}
                className={`
                w-6 h-6 rounded-full flex items-center justify-center
                border-2 transition-all duration-300
                ${
                  todo.completed
                    ? "bg-linear-to-br from-indigo-500 to-purple-600 border-transparent"
                    : "border-gray-300 bg-white"
                }
              `}
              >
                <FaCheck
                  className={`text-black text-sm transition-all
                  ${
                    todo.completed
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-100"
                  }
                `}
                />
              </button>

              <span
                className={todo.completed ? "line-through text-gray-400" : ""}
              >
                {todo.title}
              </span>
            </div>
            <div className=" flex gap-2 justify-center items-center">
              <div
                onClick={() => handleDelete(todo._id)}
                className="w-6 h-6 rounded-full flex items-center justify-center
               hover:bg-red-500 hover:border-red-500
             hover:text-white cursor-pointer transition"
              >
                X
              </div>
              <div
                onClick={() => handelUbdate(todo)}
                className="w-6 h-6 rounded-full flex items-center justify-center
   hover:bg-blue-500 hover:border-blue-500
 hover:text-white cursor-pointer transition"
              >
                U
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 pl-4 p-4">
        <button
          onClick={() => setFilter("all")}
          className={` cursor-pointer ${filter === "all" ? "text-blue-500 font-bold   " : ""} `}
        >
          All
        </button>

        <button
          onClick={() => setFilter("completed")}
          className={` cursor-pointer ${filter === "completed" ? "text-blue-500 font-bold   " : ""} `}
        >
          Completed
        </button>
        {openModal && (
          <div className="absolute bg-gray-800 opacity-90 bottom-1/12 left-1/2 -translate-x-1/2 text-center">
            <div className="p-4">
              <h2 className="text-white">Update Todo</h2>

              <div className="w-[340px] border-2 rounded-2xl my-2 bg-white">
                <input
                  value={values}
                  onChange={(e) => setValues(e.target.value)}
                  className="w-full border-none outline-none p-2 rounded-2xl"
                  type="text"
                />
              </div>

              <div className="flex justify-center gap-4 text-white">
                <button
                  onClick={handleUpdateTodo}
                  className="px-4 py-1 bg-blue-600 rounded cursor-pointer"
                >
                  Update
                </button>

                <button
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-1 bg-red-600 rounded cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
