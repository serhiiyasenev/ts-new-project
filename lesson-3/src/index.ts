import './practical-task';

const person = { name: "John" };

type Person  = {
    name: string;
    age?: number;
}

type PersonKeys = keyof Person;

const key: PersonKeys = "name";

//const element = document.getElementById("image") as HTMLImageElement;
//element.src = "https://example.com/image.jpg";
//element.alt = person.name;
//
//const el = document.getElementById("input");
//el!.focus();
//el!.addEventListener("input", (event) => {
//    const input = event.target as HTMLInputElement;
//    console.log(input.value);
//});


function printValue(x: string | number) {
    if (typeof x === "string") {
        console.log(x.toUpperCase());
    } else {
        console.log(x.toFixed(2));
    }
}

printValue("hello");
printValue(3.14159);

class Dog {
    bark() {
        console.log("Woof!");
    }
}

class Cat {
    meow() {
        console.log("Meow!");
    }
}

function makeSound(animal: Dog | Cat) {
    if (animal instanceof Dog) {
        animal.bark();
    } else {
        animal.meow();
    }
}

makeSound(new Dog());
makeSound(new Cat());

const COLORS = {
    RED: "red",
    GREEN: "green",
    BLUE: "blue",
    YELLOW: "yellow"
} as const;

type Color = typeof COLORS[keyof typeof COLORS];

const myColor: Color = COLORS.RED;      

console.log(myColor);

enum Status {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED" 
}
const taskStatus: Status = Status.IN_PROGRESS;
console.log(taskStatus);

function getStatus(status: Status): string {
    switch (status) {
        case Status.PENDING:
            return "Task is pending.";
        case Status.IN_PROGRESS:
            return "Task is in progress.";
        case Status.COMPLETED:
            return "Task is completed.";
        default:
            return "Unknown status.";
    }
}

console.log(getStatus(Status.PENDING));
console.log(getStatus(Status.IN_PROGRESS));
console.log(getStatus(Status.COMPLETED));

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

console.log(Direction);

type GreetFn = (name: string) => string;

type User = {
    id: number;
    name: string;
    greet: GreetFn;
}

type Admin = {
    greet: GreetFn;
    role: string;
}

const array = [1, 2, 3];
array.filter(num => num > 1);
array.map(num => num * 2);
array.reduce((acc, num) => acc + num, 0);
array.forEach(num => console.log(num));

const names = ["Alice", "Bob", "Charlie"];
const lengths = names.map(name => name.length);
console.log(lengths);
const longNames = names.filter(name => name.length > 3);
console.log(longNames);
const concatenated = names.reduce((acc, name) => acc + ", " + name);
console.log(concatenated);

const sum = array.reduce((acc, num) => acc + num, 0);
console.log(sum);
console.log('------------------------------------------------------');

