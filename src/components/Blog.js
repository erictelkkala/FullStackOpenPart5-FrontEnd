import { useState } from "react";

const Blog = (props, refs) => {
  const [visible, setVisible] = useState(false);

  const hidden = { display: visible ? "" : "none" };

  // Assign the blog to a const from the props
  const blog = props.blog;

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <article style={blogStyle}>
      {blog.title} {blog.author} {""}
      {!visible ? (
        <button onClick={toggleVisibility}>Expand</button>
      ) : (
        <button onClick={toggleVisibility}>Collapse</button>
      )}
      <div style={hidden}>
        <a href={blog.url}>{blog.url}</a>
        <br></br>
        {blog.likes} likes{" "}
        <button onClick={() => props.like(blog)}>Like</button>
        <br></br>
        {blog.user.name}
      </div>
    </article>
  );
};

export default Blog;
