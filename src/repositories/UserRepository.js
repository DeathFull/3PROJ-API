import  { UserModel } from "../models/UserModel.js";


class UserRepository {
    async listUsers() {
        const user = await UserModel.find(
            {},
        {
            firstname : true,
            lastname : true,
            email : true,
            }
        );
        return user
    }
}
export default new UserRepository();
