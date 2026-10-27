(() => {
  "use strict";
  // All game limits are constants at the top, as required.
  const CODE_LENGTH = 4;
  const MAX_ATTEMPTS = 8;
  const MIN_DIGIT = 0;
  const MAX_DIGIT = 9;
  let secretCode = "";
  let attempts = 0;
  let finished = false;
  const form = document.querySelector("#guessForm");
  const input = document.querySelector("#guessInput");
  const history = document.querySelector("#guessHistory");
  const message = document.querySelector("#gameMessage");
  const attemptsLeft = document.querySelector("#attemptsLeft");
  const roundState = document.querySelector("#roundState");

  function randomDigit() { return Math.floor(Math.random() * (MAX_DIGIT - MIN_DIGIT + 1)) + MIN_DIGIT; }
  function makeCode() {
    let code = "";
    while (code.length < CODE_LENGTH) {
      const digit = String(randomDigit());
      if (!code.includes(digit)) code += digit;
    }
    return code;
  }
  function setMessage(text, kind = "") { message.textContent = text; message.className = `message ${kind}`.trim(); }
  function updateState() {
    attemptsLeft.textContent = String(MAX_ATTEMPTS - attempts);
    roundState.textContent = finished ? "Finished" : "In progress";
    input.disabled = finished;
    form.querySelector("button").disabled = finished;
  }
  function renderGuess(guess, exact, misplaced) {
    const item = document.createElement("li");
    item.textContent = `${guess} — ${exact} in the right place, ${misplaced} in the wrong place`;
    history.querySelector(".empty")?.remove();
    history.prepend(item);
  }
  function startGame() {
    secretCode = makeCode(); attempts = 0; finished = false;
    history.replaceChildren();
    const empty = document.createElement("li"); empty.className = "empty"; empty.textContent = "Your guesses will appear here."; history.append(empty);
    input.value = ""; setMessage("New code generated. Good luck!"); updateState();
  }
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (finished) return;
    const guess = input.value.trim();
    // Reject invalid moves without changing the game state.
    if (!new RegExp(`^\\d{${CODE_LENGTH}}$`).test(guess) || new Set(guess).size !== CODE_LENGTH) {
      setMessage("Enter exactly four digits without repeats.", "error"); return;
    }
    attempts++;
    let exact = 0, misplaced = 0;
    for (let i = 0; i < CODE_LENGTH; i++) {
      if (guess[i] === secretCode[i]) exact++;
      else if (secretCode.includes(guess[i])) misplaced++;
    }
    renderGuess(guess, exact, misplaced);
    if (exact === CODE_LENGTH) { finished = true; setMessage(`Correct! You cracked the code in ${attempts} attempt(s).`, "success"); }
    else if (attempts === MAX_ATTEMPTS || (attempts >= MAX_ATTEMPTS && exact !== CODE_LENGTH)) { finished = true; setMessage(`No attempts left. The code was ${secretCode}.`, "error"); }
    else if (exact > 0 && misplaced > 0) setMessage(`${exact} digit(s) correct and in the right place; ${misplaced} correct but misplaced.`);
    else setMessage(`${exact} in the right place, ${misplaced} in the wrong place.`);
    input.value = ""; updateState();
  });
  document.querySelector("#restartGame").addEventListener("click", startGame);
  startGame();
})();