function fibonacciGenerator (n) {
//Do NOT change any of the code above 👆
    
    //Write your code here:
    var output = [];
    
    if (n === 1) {
        output = [0];
    } else if (n === 2) {
        output = [0, 1];
    } else if (n > 2) {
        output = [0, 1];
        for (var i = 2; i < n; i++) {
            output.push(output[i - 1] + output[i - 2]);
        }
    }
    
    //Return an array of fibonacci numbers starting from 0.
    return output;
    
//Do NOT change any of the code below 👇
}

// Test the function
console.log(fibonacciGenerator(1));   // [0]
console.log(fibonacciGenerator(2));   // [0, 1]
console.log(fibonacciGenerator(3));   // [0, 1, 1]
console.log(fibonacciGenerator(5));   // [0, 1, 1, 2, 3]
console.log(fibonacciGenerator(10));  // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
