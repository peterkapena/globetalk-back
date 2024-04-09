import {
    getModelForClass,
    pre,
    prop,
} from "@typegoose/typegoose";
import base_model from "./base_model.js";

export interface RoomQueryHelpers { }

@pre<Room>("save", async function () {
    this.created_on = new Date().toISOString();
})
export default class Room extends base_model {
    @prop({ type: String, unique: false, required: true })
    created_by?: String;
}

export const RoomModel = getModelForClass<
    typeof Room,
    RoomQueryHelpers
>(Room, {
    options: { customName: "room" },
});
