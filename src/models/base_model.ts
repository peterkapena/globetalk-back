import { prop } from "@typegoose/typegoose";

export default class {
  _id?: String;

  @prop()
  created_on?: string;
}