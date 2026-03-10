// Generate random number between 1-6 for Player 1
var randomNumber1 = Math.floor(Math.random() * 6) + 1;

// Set Player 1's dice image
document.querySelector(".img1").setAttribute("src", "images/dice" + randomNumber1 + ".png");

// Generate random number between 1-6 for Player 2
var randomNumber2 = Math.floor(Math.random() * 6) + 1;

// Set Player 2's dice image
document.querySelector(".img2").setAttribute("src", "images/dice" + randomNumber2 + ".png");

// Determine the winner and update the title
if (randomNumber1 > randomNumber2) {
  document.querySelector("h1").innerHTML = "🚩 Player 1 Wins!";
} else if (randomNumber2 > randomNumber1) {
  document.querySelector("h1").innerHTML = "Player 2 Wins! 🚩";
} else {
  document.querySelector("h1").innerHTML = "Draw! 🤝";
}
