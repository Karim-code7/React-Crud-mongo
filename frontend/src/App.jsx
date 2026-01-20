import { useState, useEffect } from "react";
import TodoItem from "./TodoItem";
import { IoMoonOutline } from "react-icons/io5";
import { MdOutlineWbSunny } from "react-icons/md";
import { useTheme } from "./context/ThemeContext";
import axios from "axios";

const App = () => {
  const { theme, toggleTheme } = useTheme();

  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // GET todos
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/todo");
        setTodos(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // ADD todo
  const handleForm = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const res = await axios.post("/api/addlist", {
        title: input,
      });

      // حدّث الـ UI من نفس الداتا اللي رجعت من Mongo
      setTodos((prev) => [...prev, res.data.data]);
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-white dark:bg-zinc-900 overflow-hidden">
      <div
        className="relative h-100 bg-cover bg-center"
        style={{
          backgroundImage:
            theme === "light" ? "url('/light.jpg')" : "url('/dark.jpg')",
        }}
      >
        {loading ? (
          <div>loading</div>
        ) : (
          <div className="absolute overflow-auto  top-32 left-1/2 -translate-x-1/2 w-135">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-white text-4xl tracking-[0.5em] font-bold">
                TODO
              </h1>
              <button className="cursor-pointer" onClick={toggleTheme}>
                {theme === "light" ? (
                  <IoMoonOutline className="w-6 h-6 text-white" />
                ) : (
                  <MdOutlineWbSunny className="w-6 h-6 text-white" />
                )}
              </button>
            </div>

            <form onSubmit={handleForm}>
              <div className="p-4 bg-white rounded-xl shadow-xl mb-12">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Create a new todo..."
                  className="w-full outline-none text-gray-700"
                />
              </div>
            </form>

            <div className="bg-white rounded-xl shadow-xl overflow-auto max-h-96">
              <TodoItem todos={todos} setTodos={setTodos} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
