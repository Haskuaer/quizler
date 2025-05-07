class User {
    constructor(username, password){
        this.username = username;
        this.password = password;
    }

    describe(){
        return `User: ${this.username}`;
    }
}

const user = new User('user', 'user');

let users = [user];

module.exports = users;