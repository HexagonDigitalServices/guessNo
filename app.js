document.addEventListener('DOMContentLoaded', () => {
    let randomNumber = Math.floor(Math.random() * 20) + 1;  // Random number between 1 and 20
    let attemptsLeft = 4;
    let timeLeft = 30;
    let timerInterval;

    const resultElement = document.getElementById('result');
    const attemptsElement = document.getElementById('remaining');
    const timerElement = document.getElementById('time');
    const submitButton = document.getElementById('submitGuess');
    const startOverButton = document.getElementById('startOver');
    const thumbsUpContainer = document.getElementById('thumbsUp');

    // Initialize Lottie animation for thumbs-up
    const thumbsUpAnimation = lottie.loadAnimation({
        container: thumbsUpContainer, // Where to render the animation
        renderer: 'svg', // Use SVG renderer for better quality
        loop: false, // Don't loop the animation
        autoplay: false, // Don't autoplay yet
        path: './animations/Thumbs up.json' // Path to your local Lottie JSON file
    });

    // Start a new game
    const startGame = () => {
        // Reset variables
        attemptsLeft = 4;
        timeLeft = 30;
        document.getElementById('userGuess').value = '';
        resultElement.textContent = '';
        attemptsElement.textContent = attemptsLeft;
        timerElement.textContent = `${timeLeft}s`;

        // Enable submit button and hide start over button
        submitButton.disabled = false;
        startOverButton.style.display = 'none';

        // Hide thumbs-up icon
        thumbsUpContainer.style.display = 'none';

        // Start a new random number
        randomNumber = Math.floor(Math.random() * 20) + 1;

        // Start timer countdown
        clearInterval(timerInterval);
        startTimer();
    };

    // Timer functionality
    const startTimer = () => {
        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `${timeLeft}`;

            // If time is up
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                resultElement.innerHTML = `<i class="fas fa-hourglass-end"></i> Time's up! The number was ${randomNumber}.`;
                resultElement.style.color = 'brown'; // Changed color to brown
                resultElement.classList.add('shake');
                submitButton.disabled = true;
                startOverButton.style.display = 'block';  // Show Start Over button
            }
        }, 1000);
    };

    // Trigger confetti
    const triggerConfetti = () => {
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 }
        });
    };

    // Submit guess
    submitButton.addEventListener('click', () => {
        const userGuess = Number(document.getElementById('userGuess').value);

        if (!userGuess || userGuess < 1 || userGuess > 20) {
            resultElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> Please enter a valid number between 1 and 20!`;
            resultElement.style.color = 'orange';
            resultElement.classList.add('pulse');
            return;
        }

        attemptsLeft--;
        attemptsElement.textContent = attemptsLeft;

        // Check guess result
        if (userGuess === randomNumber) {
            resultElement.innerHTML = `<i class="fas fa-check-circle"></i> Congratulations! You guessed the correct number!`;
            resultElement.style.color = 'lightgreen';
            resultElement.classList.add('pulse');
            clearInterval(timerInterval);  // Stop the timer
            submitButton.disabled = true;
            startOverButton.style.display = 'block';  // Show Start Over button
            triggerConfetti(); // Trigger confetti animation

            // Trigger thumbs-up animation and animate it upwards
            thumbsUpAnimation.goToAndStop(0, true); // Reset animation to start
            thumbsUpAnimation.play(); // Play the animation
            thumbsUpContainer.style.display = 'block'; // Show thumbs-up icon
            thumbsUpContainer.style.bottom = '80px'; // Animate thumbs-up from bottom to top
        } else if (attemptsLeft === 0) {
            resultElement.innerHTML = `<i class="fas fa-times-circle"></i> Sorry, you lost! The correct number was ${randomNumber}.`;
            resultElement.style.color = 'brown'; // Changed color to brown
            resultElement.classList.add('shake');
            clearInterval(timerInterval);  // Stop the timer
            submitButton.disabled = true;
            startOverButton.style.display = 'block';  // Show Start Over button
        } else {
            if (Math.abs(userGuess - randomNumber) <= 2) {
                resultElement.innerHTML = userGuess < randomNumber ? 
                    `<i class="fas fa-arrow-up"></i> You're close! Try a slightly larger number!` : 
                    `<i class="fas fa-arrow-down"></i> You're close! Try a slightly smaller number!`;
                resultElement.style.color = 'lightblue';
            } else {
                resultElement.innerHTML = userGuess < randomNumber ? 
                    `<i class="fas fa-arrow-up"></i> Try a larger number!` : 
                    `<i class="fas fa-arrow-down"></i> Try a smaller number!`;
                resultElement.style.color = 'tan';
            }
        }
    });

    // Start Over button functionality
    startOverButton.addEventListener('click', startGame);

    // Initialize the game when the page loads
    startGame();
});