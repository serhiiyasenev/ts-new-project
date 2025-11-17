import './practical-task'

class Vehicle {
    protected make: string;
    protected model: string;
    protected year: number;

    constructor(make: string, model: string, year: number) {
        this.make = make;
        this.model = model;
        this.year = year;
    }

    public getInfo(): string {
        return `${this.year} ${this.make} ${this.model}`;
    }

    public start(): void {
        console.log("Vehicle started!");
    }

    public stop(): void {
        console.log("Vehicle stopped!");
    }
}

class Car extends Vehicle {
    private numberOfDoors: number;

    constructor(make: string, model: string, year: number, numberOfDoors: number) {
        super(make, model, year);
        this.numberOfDoors = numberOfDoors;
    }

    public getNumberOfDoors(): number {
        return this.numberOfDoors;
    }

    public honk(): void {
        console.log("Beep beep!");
    }
}

class Engine {
    private horsepower: number;
    private type: string;       
    private isRunning: boolean;

    constructor(horsepower: number, type: string) {
        this.horsepower = horsepower;
        this.type = type;
        this.isRunning = false;
    }
    public start(): void {
        this.isRunning = true;
        console.log("Engine started");
    }   

    public stop(): void {
        this.isRunning = false;
        console.log("Engine stopped");
    }
    public getStatus(): string {
        return this.isRunning ? "Running" : "Stopped";
    }   
}

class CarWithEngine extends Car {
    private engine: Engine;
    constructor(make: string, model: string, year: number, numberOfDoors: number, engine: Engine) {
        super(make, model, year, numberOfDoors);
        this.engine = engine;
    }
    public startCar(): void {
        this.engine.start();
        this.start();
    }
    public stopCar(): void {
        this.stop();
        this.engine.stop();
    }
    public getEngineStatus(): string {
        return this.engine.getStatus();
    }
}

// Example usage
const myEngine = new Engine(300, "V6");
const myCar = new CarWithEngine("Toyota", "Camry", 2020, 4, myEngine);
myCar.startCar();
console.log(myCar.getInfo());
console.log(`Number of doors: ${myCar.getNumberOfDoors()}`);
console.log(`Engine status: ${myCar.getEngineStatus()}`);
myCar.honk();
myCar.stopCar();
console.log(`Engine status: ${myCar.getEngineStatus()}`);

console.log("------------------------------------------------------");

class Employee {
    private name: string;
    private position: string;
    private salary: number;

    constructor(name: string, position: string, salary: number) {
        this.name = name;
        this.position = position;
        this.salary = salary;
    }

    public getDetails(): string {
        return `Name: ${this.name}, Position: ${this.position}, Salary: $${this.salary}`;
    }

    public increeaseSalary(amount: number): void {
        this.salary += amount;
    }
}

const employee1 = new Employee("Alice", "Developer", 70000);
console.log(employee1.getDetails());
employee1.increeaseSalary(5000);
console.log(employee1.getDetails());
console.log("------------------------------------------------------");

class User {
    static role: string = "Guest";
    private username: string;
    private email: string;  

    constructor(username: string, email: string) {
        this.username = username;
        this.email = email;
    }

    public getInfo(): string {
        return `Username: ${this.username}, Email: ${this.email}, Role: ${User.role}`;
    }

    public static setRole(newRole: string): void {
        User.role = newRole;
    }

    public static getRole(): void {
        console.log(`Current role is: ${User.role}`);
    }
}

const user1 = new User("john_doe", "email@com.ua");
console.log(user1.getInfo());
User.setRole("Admin");
const user2 = new User("jane_doe", "2@email.com");
console.log(user2.getInfo());
User.getRole();
console.log("------------------------------------------------------");

class Rectangle {
    constructor(private width: number, private height: number) {}

    public getArea(): number {
        return this.width * this.height;
    }

    setWidth(width: number): void {
        this.width = width;
    }

    setHeight(height: number): void {
        this.height = height;
    }   
}

const rect = new Rectangle(10, 5);
console.log(`Area: ${rect.getArea()}`);
rect.setWidth(20);
rect.setHeight(10);
console.log(`Updated Area: ${rect.getArea()}`);
console.log("------------------------------------------------------");
