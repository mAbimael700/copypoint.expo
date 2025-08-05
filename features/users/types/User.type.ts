import {Person} from "~/features/persons/types/Person.type";

export interface UserResponse {
    id: string;
    username: string;
    email: string;
    personalInfo?: Person
    creationDate: Date
}

export default UserResponse