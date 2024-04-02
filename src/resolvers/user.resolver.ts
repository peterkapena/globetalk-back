import { Mutation, Resolver, Arg, Query } from "type-graphql";
import { VerifyTokenOutput } from "../schema/user/token.verify.js";
import UserService from "../services/user.service.js";
import { SigninOutput, SigninInput } from "../schema/user/signin.user.js";
import { SignupInput,  } from "../schema/user/create.user.js";

@Resolver()
export default class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @Query(() => String)
  async test(): Promise<String> {
    return "Success";
  }

  @Mutation(() => VerifyTokenOutput)
  async verifyToken(
    @Arg("input") inputToken: string
  ): Promise<VerifyTokenOutput> {
    return this.userService.verifyToken(inputToken);
  }

  @Mutation(() => SigninOutput)
  async signin(@Arg("input") input: SigninInput) {
    return this.userService.signin(input);
  }

  @Mutation(() => Boolean)
  async signup(@Arg("input") input: SignupInput) {
    return this.userService.signUp(input.email, input.password, input.email);
  }
}
