const firstName: string = "John";
const lastName: string = "Doe"; 
const age: number = 30;
const isMarried: boolean = false;
const id: string = "12345";
const address: undefined = undefined;
const phone: undefined = undefined;
const hobbies: string[] = ["reading", "traveling", "swimming"];
const isConfirmed: boolean = true;

function isUserConfirmed(isConfirmed: boolean): string {
    if (isConfirmed) {
        return `User ${firstName} ${lastName} is confirmed`;
    } else {
        return "User is not confirmed";
    };
}

console.log(isUserConfirmed(isConfirmed));

type User = {
    readonly id: string;
    firstName: string;
    lastName: string;
    age: number;
    isMarried: boolean;
    address?: string;
    phone?: string;
    hobbies: string[];
    isConfirmed: boolean;
};

const user: User = {
    id: "12345",
    firstName: "John",
    lastName: "Doe",
    age: 30,
    isMarried: false,      
    hobbies: ["reading", "traveling", "swimming"],
    isConfirmed: true
};

const user1: User = {
    id: "12345",
    firstName: "John",
    lastName: "Doe",
    age: 30,
    isMarried: false,      
    hobbies: ["reading", "traveling", "swimming"],
    isConfirmed: true
};

const users: User[] = [user, user1];

console.log(users);

type Admin = User & {
    role: "admin" | "superadmin";
};

const admin: Admin = {
    id: "1",
    firstName: "Admin", 
    lastName: "User",
    age: 35,
    isMarried: true,
    hobbies: [],
    isConfirmed: true,
    role: "admin"
};

console.log(admin);