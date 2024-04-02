import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class VerifyTokenOutput {
  @Field(() => Boolean)
  isValid!: Boolean;

  @Field(() => String, { nullable: true })
  email!: String;

  @Field(() => String)
  token!: String;
}