import { animals, biology, physics, cars } from "./arrays.js";

const keys = document.querySelectorAll(".key");
const word = document.querySelector(".word");
const lives = document.querySelector(".lives-count");
const result = document.querySelector(".result-pg");
const resultStatement = document.querySelector(".result-statement");
const reloadButton = document.querySelector(".new-word-btn");
const resetPage = document.querySelector(".reset-pg");
const resetButton = document.querySelector(".reset-btn");
const categoryBtn = document.querySelector(".category-btn button");
const categoriesPage = document.querySelector(".categories-pg");
const categoryOptions = document.querySelectorAll(".option");

categoryBtn.addEventListener("click", () => {
	categoriesPage.style.display = "flex";

	// Now to give the class 'selected' to the category that is selected
	const selectedCategory = JSON.parse(localStorage.getItem("category"));
	for (let option of categoryOptions) {
		if (option.textContent.toLowerCase() == selectedCategory) {
			option.classList.add("selected");
		}
	}
});
categoriesPage.addEventListener("click", (e) => {
	if (e.target.classList.contains("option")) {
		localStorage.setItem(
			"category",
			JSON.stringify(e.target.textContent.toLowerCase())
		);
		location.reload();
	}
});

const words = () => {
	if (localStorage.getItem("category") === null) {
		return animals;
	} else {
		let categoryString = JSON.parse(localStorage.getItem("category"));
		return eval(categoryString); // this converts the string that we get from the local storage into a variable name
	}
};

const randomWordGenerator = (array) => {
	let wonWords = JSON.parse(localStorage.getItem("wonWords"));
	if (wonWords !== null) {
		for (let word of wonWords) {
			if (array.includes(word.toLowerCase())) {
				array = array.filter((item) => item !== word.toLowerCase());
			}
		}
	}
	let randomIndex = Math.floor(Math.random() * array.length);

	if (!array[randomIndex]) {
		return false;
	} else {
		return array[randomIndex].toUpperCase().split("");
	}
};

if (!randomWordGenerator(words())) {
	resetPage.style.display = "flex";
	resetButton.addEventListener("click", () => {
		localStorage.clear();
		location.reload();
	});
} else {
	var wordArray = randomWordGenerator(words());
	for (let letter of wordArray) {
		word.innerHTML += `
		<div class='letters-container'>
		<h1 class='letter removed'>${letter}</h1>
		<div class='underline'></div>
		</div>
		`;
	}
}
let livesCount = wordArray.length * 3;

const letters = document.querySelectorAll(".letter");
const uniqueLetters = [];
for (let letter of letters) {
	if (!uniqueLetters.includes(letter.textContent)) {
		uniqueLetters.push(letter.textContent);
	}
}
let numberOfRightKeysPressed = [];

// function to store the words that were guessed right by the player into the local storage so that they do not appear again
const localStorageManager = (wordArray) => {
	let wonWords = localStorage.getItem("wonWords");
	if (wonWords === null) {
		wonWords = [];
		wonWords.push(wordArray.join(""));
		localStorage.setItem("wonWords", JSON.stringify(wonWords));
	} else {
		wonWords = JSON.parse(wonWords);
		wonWords.push(wordArray.join(""));
		localStorage.setItem("wonWords", JSON.stringify(wonWords));
	}
};

for (let key of keys) {
	key.addEventListener("click", () => {
		if (uniqueLetters.includes(key.textContent)) {
			if (!numberOfRightKeysPressed.includes(key.textContent)) {
				numberOfRightKeysPressed.push(key.textContent);
			}
			for (let letter of letters) {
				if (letter.textContent === key.textContent) {
					letter.classList.remove("removed");
				}
			}
			if (numberOfRightKeysPressed.length === uniqueLetters.length) {
				resultStatement.textContent = "YOU WIN !!!!";
				resultStatement.style.color = "green";
				result.style.display = "flex";
				reloadButton.textContent = "Next Word";

				reloadButton.addEventListener("click", () => {
					location.reload();
				});
				localStorageManager(wordArray);
			}
		} else {
			livesCount -= 1;
			if (livesCount <= 0) {
				resultStatement.textContent = "YOU LOSE !!!!";
				resultStatement.style.color = "red";
				result.style.display = "flex";
				reloadButton.textContent = "TRY AGAIN";

				reloadButton.addEventListener("click", () => {
					location.reload();
				});
			}
		}

		lives.textContent = livesCount;
	});
}
lives.textContent = livesCount;
