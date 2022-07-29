import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import newLoginForm from "./components/LoginForm";
import newBlogForm from "./components/BlogForm";
import Notification from "./components/Notification";

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
      const newBlog = await blogService.create(blog, user);
      setBlogs(blogs.concat(newBlog));
      setSM("A new blog" + newBlog.title + " by " + newBlog.author + " added");
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

  // Declare the login form imported from the LoginForm component
  const loginForm = newLoginForm(
    handleLogin,
    username,
    setUsername,
    password,
    setPassword
  );

  // Declare the blog form imported from the BlogForm component
  const blogForm = newBlogForm(
    addBlog,
    newTitle,
    setNewTitle,
    newAuthor,
    setNewAuthor,
    newUrl,
    setNewUrl
  );

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
        loginForm()
      ) : (
        <div>
          <p>
            {" "}
            {user.name} logged in {logoutButton()}
          </p>{" "}
          {blogForm()}
          <BlogList />
        </div>
      )}
    </div>
  );
};

export default App;
