function whosPaying(names) {
    
/******Don't change the code above*******/
    
    // Generate a random index from 0 to names.length - 1
    var randomIndex = Math.floor(Math.random() * names.length);
    
    // Get the name at that random index
    var selectedPerson = names[randomIndex];
    
    // Return the message
    return selectedPerson + " is going to buy lunch today!";

/******Don't change the code below*******/    
}

// Test the function
console.log(whosPaying(["Angela", "Ben", "Jenny", "Michael", "Chloe"]));
