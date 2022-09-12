//#region global variables
let resultContent = null;
let numbersButtons = null;
let opertaorsButtons = null;
let result = null;
let lastOperator = null;
let operationElement = null;
let operationValue = null;

const operators = ['+', '-', '*', '/'];
//#endregion global variables

//#region methods
const initElements = () => {
  resultContent = document.querySelector(".result-container__result-label");
  numbersButtons = document.querySelectorAll(".calculator-numbers__num-btn");
  opertaorsButtons = document.querySelectorAll(".calculator-operator__ctrl-btn");
  operationElement = document.querySelector(".result-container__operation-string");
  resetCalculator();
  lastOperator = '+';
}

const resetCalculator = () => {
  result = 0;
  operationElement.textContent = "";
  operationValue = "";
}

const updateTextContent = () => {
  resultContent.textContent = `Result: ${result}`;
}

const calculateOpertaion = () => {
  let copy = operationValue || '';

  let operationSentence = getOperationSentenceElements(copy);

  while (arrContainsOperation(operationSentence)) {
    const firstPriorityIdxs = operationSentence.map((char, idx) => {
      if (char === '*' || char === '/') {
        return idx;
      }
    }).filter(idx => idx);
    const lastPriorityIdxs = operationSentence.map((char, idx) => {
      if (char === '+' || char === '-') {
        return idx;
      }
    }).filter(idx => idx);

    if (firstPriorityIdxs.length > 0) {
      let calculatedResult = calculateOperandOpenand(
        operationSentence[firstPriorityIdxs[0] - 1],
        operationSentence[firstPriorityIdxs[0] + 1],
        operationSentence[firstPriorityIdxs[0]]);

      let newSentance = [];
      for (let idx = 0; idx < operationSentence.length; idx++) {
        const element = operationSentence[idx];
        if (idx !== +firstPriorityIdxs - 1 && idx !== +firstPriorityIdxs && idx !== +firstPriorityIdxs + 1) {
          newSentance.push(element);
        }
        if (idx === +firstPriorityIdxs - 1) {
          newSentance.push(`${calculatedResult}`);
        }
      }
      operationSentence = newSentance;
    } else {
      calculatedResult = calculateOperandOpenand(
        operationSentence[lastPriorityIdxs[0] - 1],
        operationSentence[lastPriorityIdxs[0] + 1],
        operationSentence[lastPriorityIdxs[0]]);

      newSentance = [];
      for (let idx = 0; idx < operationSentence.length; idx++) {
        const element = operationSentence[idx];
        console.log(element)
        if (idx !== +lastPriorityIdxs - 1 && idx !== +lastPriorityIdxs && idx !== +lastPriorityIdxs + 1) {
          newSentance.push(element);
        }
        if (idx === +lastPriorityIdxs - 1) {
          newSentance.push(`${calculatedResult}`);
        }
      }
      operationSentence = newSentance;
    }
  }
  result = operationSentence;
  updateTextContent();
}

const getOperationSentenceElements = (operationSentance) => {
  let number = '';
  const sentanceElements = [];
  [...operationSentance].forEach((char, idx) => {
    if (idx === [...operationSentance].length - 1) {
      number += char;
      sentanceElements.push(number);
    }
    if (operators.indexOf(char) === -1) {
      number += char;
    } else {
      if (number !== '') {
        sentanceElements.push(number);
        number = '';
      }
      sentanceElements.push(char);
    }
  });

  return sentanceElements;
}

const calculateOperandOpenand = (operand, openand, operation) => {
  let value = 0;
  switch (operation) {
    case '+':
      value = +operand + +openand;
      break;
    case '-':
      value = +operand - +openand;
      break;
    case '*':
      value = +operand * +openand;
      break;
    case '/':
      value = +operand / +openand;
      break;

  }
  return value;
}

const arrContainsOperation = (arr) => {
  if (arr && arr.length) {
    for (e of arr) {
      if (operators.indexOf(e) > -1) {
        return true;
      }
    }
  }
  return false;
}
//#endregion methods


//main method

document.addEventListener("DOMContentLoaded", () => {
  initElements();

  updateTextContent();

  numbersButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      if (!operationValue) {
        operationValue = '';
      }
      operationValue += e.target.textContent;
      operationElement.textContent = operationValue;
    });
  });

  opertaorsButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      if (operationValue) {
        const invalidInput = operators.indexOf(operationValue[operationValue.length - 1]) > -1;
        switch (e.target.textContent) {
          case 'AC':
            resetCalculator();
            updateTextContent();
            break;
          case '=':
            if (invalidInput) {
              operationValue = operationValue.slice(0, operationValue.length - 1);
              operationElement.textContent = operationValue;
            }
            calculateOpertaion();
            updateTextContent();
            break;
          default:
            const newValue = e.target.textContent;


            if (!invalidInput) {
              operationValue += newValue;
              operationElement.textContent = operationValue;
            }
            break;
        }
        lastOperator = e.target.textContent;

      }
    });
  })

})