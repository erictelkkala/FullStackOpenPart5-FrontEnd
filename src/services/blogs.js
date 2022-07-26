import axios from "axios";
const baseUrl = "/api/blogs";

const getAll = async () => {
  const request = axios.get(baseUrl);
  const response = await request;
  return response.data;
};

const create = async (newObject, user) => {
  // Get the token from the user object
  const config = {
    headers: { Authorization: `bearer ${user.token}` },
  };
  const request = axios.post(baseUrl, newObject, config);
  const response = await request;
  return response.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create };
