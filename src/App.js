import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import newLoginForm from "./components/LoginForm";
import newBlogForm from "./components/BlogForm";

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
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
      window.localStorage.setItem("user", JSON.stringify(user));
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("Wrong username or password");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    setUser(null);
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
      setNewTitle("");
      setNewAuthor("");
      setNewUrl("");
    } catch (exception) {
      setErrorMessage("Error adding blog");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
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

      {/* <Notification message={errorMessage} /> */}
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
