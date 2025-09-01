export default class UserDTO{
    constructor(user) {
        this.id = user._id?.toString?.() ?? user.id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.age = user.age;
        this.role = user.role;
    }

    toJson(){
        return {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            age: this.age,
            role: this.role,
        };
    }
}