const LoginForm = (props) => {
  return (
    <form onSubmit={props.handleLogin}>
      <div>
        username
        <input value={props.username} onChange={props.handleChangeUsername} />
      </div>
      <div>
        password
        <input
          value={props.password}
          type="password"
          onChange={props.handleChangePassword}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );
};

export default LoginForm;
