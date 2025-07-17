export interface LoginCredentials {
    email: string;
    password: string;
}

export type UserCreationDto = LoginCredentials & {
    personalInfo: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
    }
}

export type SignUpResponse = UserCreationDto & {
    creationDate: string;
}