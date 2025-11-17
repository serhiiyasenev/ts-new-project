type User = {
  readonly id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | string;
  phone?: string | number | null;
  middleName?: string | null;
  emailVerified: boolean;
  hobbies: string[];
};


const user1: User = {
  id: "1",
  firstName: "Alice",
  lastName: "Smith",
  dateOfBirth: new Date("1992-03-21"),
  phone: "+380501234567",
  middleName: null,
  emailVerified: true,
  hobbies: ["reading", "traveling"]
};

const user2: User = {
  id: "2",
  firstName: "Bob",
  lastName: "Brown",
  dateOfBirth: "1990-12-01",
  phone: null,
  middleName: "Michael",
  emailVerified: false,
  hobbies: ["music", "gaming"]
};


const users: User[] = [user1, user2];

const printUserCard = (
  firstName: string,
  lastName: string,
  dateOfBirth?: Date | string,
  phone?: string | number | null
): void => {
  const dobStr =
    dateOfBirth instanceof Date
      ? dateOfBirth.toISOString().slice(0, 10)
      : dateOfBirth ?? "—";

  const phoneStr = phone ?? "—";

  const card = [
    "================ USER ================",
    `Name          : ${firstName} ${lastName}`,
    `Date of Birth : ${dobStr}`,
    `Phone         : ${phoneStr}`,
    "======================================"
  ].join("\n");

  console.log(card);
};

printUserCard("Alice", "Smith");
printUserCard("Alice", "Smith", user1.dateOfBirth);
printUserCard("Bob", "Brown", user2.dateOfBirth, user2.phone);

console.log("Users:", users);
