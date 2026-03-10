function lifeInWeeks(age) {
    
/************Don't change the code above************/    
    
    // Calculate years left until 90
    var yearsLeft = 90 - age;
    
    // Calculate days, weeks, and months left
    var days = yearsLeft * 365;
    var weeks = yearsLeft * 52;
    var months = yearsLeft * 12;
    
    // Output the result
    console.log("You have " + days + " days, " + weeks + " weeks, and " + months + " months left.");
    
/*************Don't change the code below**********/
}

// Test the function
lifeInWeeks(56);
