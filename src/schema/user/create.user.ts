import { InputType, Field } from "type-graphql";

@InputType()
export class SignupInput {
  @Field(() => String)
  email: String;

  @Field(() => String)
  password: String;
}
