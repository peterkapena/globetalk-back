import RoomResolver from "./room.resolver.js";
import UserResolver from "./user.resolver.js";

const resolvers = [UserResolver, RoomResolver] as const;

export { resolvers };
