import create_default_user from "./create_default_user.js";
import { connectToMongoDB } from "./mongo.js";

(async function () {
  await connectToMongoDB();
  await create_default_user();
})();