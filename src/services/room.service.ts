import { RoomModel } from "../models/room.js";

export default class RoomService {
    constructor() { }

    async create(created_by: String): Promise<String> {
        const created = await RoomModel.create({ created_by });
        return created.id;
    }
}