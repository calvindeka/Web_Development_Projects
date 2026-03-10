function isLeap(year) {
    
/**************Don't change the code above****************/    
    
    if (year % 4 === 0) {
        // Divisible by 4
        if (year % 100 === 0) {
            // Divisible by 100
            if (year % 400 === 0) {
                // Divisible by 400 - IS a leap year
                console.log("Leap year.");
            } else {
                // Divisible by 100 but NOT by 400 - NOT a leap year
                console.log("Not leap year.");
            }
        } else {
            // Divisible by 4 but NOT by 100 - IS a leap year
            console.log("Leap year.");
        }
    } else {
        // NOT divisible by 4 - NOT a leap year
        console.log("Not leap year.");
    }

/**************Don't change the code below****************/    

}

// Test the function
isLeap(2400);  // Leap year.
isLeap(1989);  // Not leap year.
isLeap(2000);  // Leap year.
isLeap(2100);  // Not leap year.
