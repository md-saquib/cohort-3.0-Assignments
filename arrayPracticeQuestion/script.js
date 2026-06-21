
// for Question no 1

let prices = [100, 250, 500, 150, 700];

let expensiveProduct = prices.filter((product) => product > 300);

console.log(expensiveProduct);

// for Quesiton no 2

let marks = [80, 90, 70, 85, 95];

let avg = marks.reduce((acc, curr) => {
    acc = acc + curr;
    return acc;
}, 0)

console.log(avg / marks.length)

// for Question no 3

let numbers = [1, 2, 3, 2, 4, 2, 5, 1, 1, 1];

let frequency = numbers.reduce((acc, curr) => {

    acc[curr] = (acc[curr] || 0) + 1;

    return acc;
}, {})

console.log(frequency);

// for Question no 4


let user = {
    name: "Ritik",
    age: 20
};

user.age = 21;

console.log(user);


// Question 5 (Moderate) — Print User Information

let newUser = {
    name: "Ritik",
    age: 20,
    city: "Bhopal"
};

for (const [key, value] of Object.entries(newUser)) {

    console.log(`${key} : ${value}`);

}

// Question 6 (Hard) — Highest Paid Employee
let employees = {
    aman: 25000,
    ritik: 50000,
    priya: 45000
};
let highPaid = 0;
let mostSalaryAchiver = '';
for (const [key, value] of Object.entries(employees)) {

    if (value > highPaid) {
        highPaid = value;
        mostSalaryAchiver = key;
    }

}

console.log(mostSalaryAchiver);

// Question 7 (Easy) — Greeting Function


function greet(name) {
    console.log(`Hello ${name}`);
}

greet('saquib');

// Question 8 (Moderate) — Discount Calculator



function calculateDiscount(price) {

    return (price * 10) / 100;
}

console.log(calculateDiscount(10))


// Question 9 (Hard) — Dynamic Sum Function

function sum(...numbers) {
    let sum = numbers.reduce((acc, curr) => {
        acc = acc + curr;
        return acc;
    })
    return sum;
}

console.log(sum(2, 5, 6, 4, 7, 8));

// Question 10 (Easy) — Find Adult Users
let users = [
    { name: "Ritik", age: 20 },
    { name: "Aman", age: 16 },
    { name: "Priya", age: 25 }
];


function getAdults(users) {
    return users.filter(el => el.age >= 18);
}

console.dir(getAdults(users));


// Question 11 (Moderate) — Shopping Cart Total
let cart = [
    { name: "Mouse", price: 500, qty: 2 },
    { name: "Keyboard", price: 1000, qty: 1 },
    { name: "Monitor", price: 10000, qty: 1 }
];

function getCartTotal(cart) {
    let totalCartSum = cart.reduce((acc, curr) => {
        acc = acc + (curr.price * curr.qty);
        return acc;
    }, 0)

    return totalCartSum;
}

console.log(getCartTotal(cart));


// Question 12 (Hard) — Student Grade Report
let students = [
    {
        name: "Ritik",
        marks: [80, 90, 85]
    },
    {
        name: "Aman",
        marks: [50, 40, 60]
    }
];

function genrateReport(students) {

    students.forEach(element => {

        let marks = element.marks.reduce((acc, curr) => {
            acc = acc + curr;
            return acc
        }, 0);

        element["grade"] = marks / students.length;

    });

    return students;
}

console.log(genrateReport(students))