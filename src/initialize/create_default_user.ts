import UserService from "../services/user.service.js";

export default (async function () {
  console.log("create default user")
  process.env.PETER_KAPENA_PASSWORD &&
    process.env.PETER_KAPENA_EMAIL &&
    (await new UserService().signUp(
      process.env.PETER_KAPENA_EMAIL,
      process.env.PETER_KAPENA_PASSWORD,
      process.env.PETER_KAPENA_EMAIL
    ));
});
