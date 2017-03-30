'use strict';

function getRandomColor() {
    let availableColors = colors.length - 1;
    let currentColor = colors[Math.round(Math.random() * availableColors)];
    if (colorsWhichAreSelected.indexOf(currentColor) < 0) {
        colorsWhichAreSelected.push(currentColor);
    } else {
        colors.splice(colors.indexOf(currentColor));
    }
    return currentColor;

}

function generateRandomColorsArr(count) {

    let cardColors = [];

    for (let i = 0; i < count / 2; i += 1) {
        let rndIndex = Math.floor(Math.random() * colors.length);
        cardColors.push(colors[rndIndex]);
        cardColors.push(colors[rndIndex]);
    }
    return cardColors;
}