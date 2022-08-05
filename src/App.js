import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Toggleable";

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
    // If the user is cached, get the user from localStorage
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      setUser(user);
      setSM(`${user.name} logged in`);
      window.localStorage.setItem("user", JSON.stringify(user));
      setUsername("");
      setPassword("");
    } catch (exception) {
      setEM("Wrong username or password");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setSM("Logged out");
    window.localStorage.removeItem("user");
  };

  async function addBlog(event) {
    event.preventDefault();
    const blog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    };
    try {
      // Toggle the visibility
      blogFormRef.current.toggleVisibility();
      const newBlog = await blogService.create(blog, user);
      setBlogs(blogs.concat(newBlog));
      setSM(
        'A new blog "' + newBlog.title + '" by "' + newBlog.author + '" added'
      );
      setNewTitle("");
      setNewAuthor("");
      setNewUrl("");
    } catch (exception) {
      setEM("Error adding blog");
    }
  }

  function setEM(message) {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  }

  function setSM(message) {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  }

  const logoutButton = () => <button onClick={handleLogout}>logout</button>;

  function BlogList() {
    return (
      <div>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>

      {/* Error or success notification */}
      {errorMessage === null ? (
        <Notification message={successMessage} type="success" />
      ) : (
        <Notification message={errorMessage} />
      )}

      {/* Display the login form if the user is not logged in */}
      {user === null ? (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          handleChangeUsername={({ target }) => setUsername(target.value)}
          password={password}
          handleChangePassword={({ target }) => setPassword(target.value)}
        />
      ) : (
        <div>
          <p>
            {" "}
            {user.name} logged in {logoutButton()}
          </p>{" "}
          <Togglable buttonLabel="Add a new blog" ref={blogFormRef}>
            <BlogForm
              addBlog={addBlog}
              newTitle={newTitle}
              handleChangeTitle={({ target }) => setNewTitle(target.value)}
              newAuthor={newAuthor}
              handleChangeAuthor={({ target }) => setNewAuthor(target.value)}
              newUrl={newUrl}
              handleChangeUrl={({ target }) => setNewUrl(target.value)}
            />
          </Togglable>
          <BlogList />
        </div>
      )}
    </div>
  );
};

export default App;
