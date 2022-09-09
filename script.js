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

    // todo: change the code to use array list instead of while loop
    while (strContainsOperation(copy)) {
        const idxOfMultiply = copy.indexOf('*');
        const idxOfDevider = copy.indexOf('/');

        if (idxOfMultiply > -1 || idxOfDevider > -1) {
            let firstIdx = -1;

            if ((idxOfMultiply > -1 && idxOfDevider > -1) && idxOfMultiply < idxOfDevider) { firstIdx = idxOfMultiply }
            else if ((idxOfMultiply > -1 && idxOfDevider > -1) && idxOfDevider < idxOfMultiply) { firstIdx = idxOfDevider }
            else if ((idxOfMultiply > -1 && idxOfDevider === -1)) { firstIdx = idxOfMultiply }
            else if ((idxOfMultiply === -1 && idxOfDevider > -1)) { firstIdx = idxOfDevider }


            const partOne = copy.slice(0, firstIdx);
            const partTwo = copy.slice(firstIdx + 1, copy.length);
            const operation = copy[firstIdx];

            let partOneNumbers = getNumbersFromOperationString(partOne);
            let partTwoNumbers = getNumbersFromOperationString(partTwo);

            const calculate = calculateOperandOpenand(partOneNumbers[partOneNumbers.length - 1], partTwoNumbers[0], operation);

            partOneNumbers.pop();
            partTwoNumbers.shift();

            const newPartOne = generateNewPart(partOne, true);
            const newPartTwo = generateNewPart(partTwo, false);

            copy = newPartOne + calculate + newPartTwo;
            operationElement.textContent = copy;
        } else {
            firstIdx = -1;
            const idxOfPlus = copy.indexOf('+');
            const idxOfMinus = copy.indexOf('-');
            if ((idxOfPlus > -1 && idxOfMinus > -1) && idxOfPlus < idxOfMinus) { firstIdx = idxOfPlus }
            else if ((idxOfPlus > -1 && idxOfMinus > -1) && idxOfMinus < idxOfPlus) { firstIdx = idxOfMinus }
            else if ((idxOfPlus > -1 && idxOfMinus === -1)) { firstIdx = idxOfPlus }
            else if ((idxOfPlus === -1 && idxOfMinus > -1)) { firstIdx = idxOfMinus }


            const partOne = copy.slice(0, firstIdx);
            const partTwo = copy.slice(firstIdx + 1, copy.length);
            const operation = copy[firstIdx];

            let partOneNumbers = getNumbersFromOperationString(partOne);
            let partTwoNumbers = getNumbersFromOperationString(partTwo);

            const calculate = calculateOperandOpenand(partOneNumbers[partOneNumbers.length - 1], partTwoNumbers[0], operation);

            partOneNumbers.pop();
            partTwoNumbers.shift();

            const newPartOne = generateNewPart(partOne, true);
            const newPartTwo = generateNewPart(partTwo, false);

            copy = newPartOne + calculate + newPartTwo;
            operationElement.textContent = copy;
        }
    }
    result = copy;
    updateTextContent();
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

const strContainsOperation = (str) => {
    for (let i = 0; i < str.length; i++) {
        const element = str[i];
        if (operators.indexOf(element) > -1) {
            return true;
        }
    }
    return false;
}

const generateNewPart = (str, isFirst) => {
    newStr = '';
    if (isFirst) {
        newStr = str.split("").reverse().join("");
        console.log(newStr)
        let lastOpIdx = -1;
        for (let i = 0; i < newStr.length && lastOpIdx === -1; i++) {
            if (operators.indexOf(newStr[i]) > -1) {
                lastOpIdx = i;
            }
        }
        if (lastOpIdx > -1) {
            newStr = newStr.slice(lastOpIdx, newStr.length);
            newStr = newStr.split("").reverse().join("");
        } else {
            return "";
        }
    } else {
        newStr = str;
        let firstOpIdx = -1;
        for (let i = 0; i < newStr.length && firstOpIdx === -1; i++) {
            if (operators.indexOf(newStr[i]) > -1) {
                firstOpIdx = i;
            }
        }

        if (firstOpIdx > -1) {
            newStr = newStr.slice(firstOpIdx, newStr.length);
        } else {
            return "";
        }
    }
    return newStr;
}

const getNumbersFromOperationString = (str) => {
    let lastNumber = '';
    const numbersArr = [];
    for (let i = 0; i < str.length; i++) {
        if (i === str.length - 1) {
            lastNumber += str[i];
            numbersArr.push(lastNumber);
            lastNumber = '';
        } else {
            if (operators.indexOf(str[i]) === -1) {
                lastNumber += str[i];
            } else {
                numbersArr.push(lastNumber);
                lastNumber = '';
            }
        }
    }
    return numbersArr;
}
//#endregion methods


//main method

const init = () => {
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

}

document.addEventListener("DOMContentLoaded", init);