interface User {
    id: number;
    username: string;
    password: string;
}

export interface DecodedUserToken {
    id: number;
}

export function getUserPassword(user: User) {
    return user.password;
}