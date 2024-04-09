import { Resolver, Mutation, Ctx, } from "type-graphql";
import RoomService from "../services/room.service.js";
import Context from "../models/context.js";


@Resolver()
export default class RoomResolver {
    constructor(private roomService: RoomService) {
        this.roomService = new RoomService();
    }

    @Mutation(() => String,)
    async createRoom(@Ctx() { user: { _id } }: Context): Promise<String> {
        return this.roomService.create(_id);
    }
}
