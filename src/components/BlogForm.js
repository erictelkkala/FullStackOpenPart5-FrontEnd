const BlogForm = (props) => {
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={props.addBlog}>
        <div>
          title
          <input value={props.newTitle} onChange={props.handleChangeTitle} />
        </div>
        <div>
          author
          <input value={props.newAuthor} onChange={props.handleChangeAuthor} />
        </div>
        <div>
          url
          <input value={props.newUrl} onChange={props.handleChangeUrl} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
