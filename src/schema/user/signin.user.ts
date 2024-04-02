import { InputType, Field, ObjectType } from "type-graphql";

@InputType()
export class SigninInput {
  @Field(() => String)
  email: String;

  @Field(() => String)
  password: String;
}

@ObjectType()
export class SigninOutput {
  @Field(() => String)
  token?: String;

  @Field(() => String, { nullable: true })
  email?: String;

  @Field(() => [String], { nullable: false })
  messages!: String[];
}
