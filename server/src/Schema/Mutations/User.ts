import { UserType } from "../TypeDefs/User";
import { GraphQLString, GraphQLID } from "graphql";
import { Users } from "../../Entities/Users";
import { MessageType } from "../TypeDefs/Messages";

export const CREATE_USER = {
  type: UserType,
  args: {
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent: any, args: any) {
    const { name, username, password } = args;
    await Users.insert({ name, username, password });
    return args;
  },
};

export const UPDATE_PASSWORD = {
  type: MessageType,
  args: {
    username: { type: GraphQLString },
    oldPassword: { type: GraphQLString },
    newPassword: { type: GraphQLString },
  },
  async resolve(parent: any, args: any) {
    const { username, oldPassword, newPassword } = args;
    const user = await Users.findOne({ username: username });
    if (!user) throw new Error("user doesn't exist");

    let userPassword = user.password;
    console.log("userPassword", userPassword);
    if (oldPassword === userPassword) {
      await Users.update({ username: username }, { password: newPassword });
      return { successful: true, message: "password updated" };
    } else {
      throw new Error("Invalid password");
    }
  },
};

export const DELETE_USER = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent: any, args: any) {
    const { id } = args;
    await Users.delete(id);
    return { succesful: true, message: "user deleted" };
  },
};
