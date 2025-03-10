interface User {
    id: number;
    username: string;
    password: string;
}

export function getUserPassword(user: User) {
    return user.password;
}