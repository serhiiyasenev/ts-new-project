//import 'reflect-metadata';

interface Logger {
    log(message: string, level?: "info" | "error"): void;
}

class Duck {
    quack(): void {
        console.log("Quack!");
    }
}

class Human {
    quack(): void {
        console.log("Hello!");
    }
}

const realDuck = new Duck();
const fakeDuck = new Human();

interface Quackable {
    quack(): void;
}

function makeItQuack(entity: Quackable): void {
    entity.quack();
}   

makeItQuack(realDuck);
makeItQuack(fakeDuck);
makeItQuack({ quack: () => console.log("Anonymous quack!") });


abstract class Vehicle {
    constructor(public brand: string) {}

    abstract start(): void;
    abstract stop(): void;
}

class Car extends Vehicle {
    constructor(brand: string, public model: string) {
        super(brand);
    }
    start(): void {
        console.log("Car started.");
    }
    stop(): void {
        console.log("Car stopped.");
    }
}

class Bike extends Vehicle {
    constructor(brand: string, public type: string) {
        super(brand);
    }
    start(): void {
        console.log("Bike started.");
    }
    stop(): void {
        console.log("Bike stopped.");
    }
    private ringBell(): void {
        console.log("Ring ring!");
    }
}

const myCar = new Car("Toyota", "Corolla");
const myBike = new Bike("Yamaha", "Sport");

myCar.start();
myBike.start();
myCar.stop();
myBike.stop(); 

function Logger(constructor: Function) {
    console.log(`Class ${constructor.name} was created.`);
}

@Logger
class User {
    constructor(public name: string, public age: number) {}
}

const user = new User(" Alice", 30);
console.log(user);