'use strict';


const stage = new Konva.Stage({
    container: 'canvas',
    width: 1600,
    height: 2000
});

const layer = new Konva.Layer();

const text = new Konva.Text({
    x: 10,
    y: 10,
    fontFamily: 'Calibri',
    fontSize: 20,
    text: '',
    fill: 'black'
});

const cards = [];

const colors = ['pink', 'yellow', 'green', 'orange', 'blue', 'red'];

var actualColors = [];

let xOffset = 0;

const colorsWhichAreSelected = [];

//Beggining
$(document).ready(Begin());

function Begin() {
    const countOfCardsInEasyDifficulty = 16;
    const countOfCardsInMediumDifficulty = 42;
    const countOfCardsInHardDifficulty = 84;
    const $easy = $('.easy');
    const $normal = $('.normal');
    const $hard = $('.hard');

    let clicked = false;

    $easy.click(function() {
        if (!clicked) {
            let items = countOfCardsInEasyDifficulty;
            let cardColors = generateRandomColorsArr(items);
            initiateField(countOfCardsInEasyDifficulty, cardColors);
            clicked = true;
        }
    });
    $normal.click(function() {
        if (!clicked) {
            let items = countOfCardsInMediumDifficulty;
            let cardColors = generateRandomColorsArr(items);
            initiateField(countOfCardsInMediumDifficulty, cardColors);
            clicked = true;
        }
    });
    $hard.click(function() {
        if (!clicked) {
            let items = countOfCardsInHardDifficulty;
            let cardColors = generateRandomColorsArr(items);
            initiateField(countOfCardsInHardDifficulty, cardColors);
            clicked = true;
        }
    });
}

/*function chooseDifficulty(items) {
    if (!clicked) {
        let cardColors = generateRandomColorsArr(items);
        initiateField(84, cardColors);
        clicked = true;
    }
}*/

function initiateField(items, cardColors) {
    let rows = 0;
    xOffset = 0;
    actualColors = [];

    let currentCard;

    for (var i = 0; i < items; i += 1) {

        let randomColorIndex = Math.floor(Math.random() * cardColors.length);

        let realColor = cardColors[randomColorIndex];
        cardColors.splice(randomColorIndex, 1);


        if (i % 10 === 0 && i !== 0) {
            ++rows;
        }

        currentCard = createCard(realColor, i, rows);
        layer.add(currentCard);

        actualColors.push(realColor);
    }
    stage.add(layer);

    setTimeout(function CardsCreation() {

        layer.destroy();

        let rows = 0;
        xOffset = 0;

        for (var i = 0; i < items; i += 1) {

            if (i % 10 === 0 && i !== 0) {
                ++rows;
            }

            currentCard = createCard('gray', i, rows);
            layer.add(currentCard);
            currentCard.tween = generateAnimation(currentCard);
        }

        layer.add(text);
        stage.add(layer);

        startGame();

    }, 1000);
}

function createCard(color, id, rows) {
    if (id % 10 === 0) {
        xOffset = 0;
    }

    let cardY = 30 + (210 * rows);
    let cardX = (120 * xOffset) + 20;

    let card = new Konva.Rect({
        x: cardX,
        y: cardY,
        fill: color,
        width: 100,
        height: 180,
        id: id
    });

    ++xOffset;

    return card;
}

function generateAnimation(card) {
    let animation = new Konva.Tween({
        node: card,
        scaleX: 1.2,
        scaleY: 1.2,
        x: card.attrs.x - 10,
        y: card.attrs.y - 10,
        easing: Konva.Easings.EaseIn,
        duration: 0.2
    });

    return animation;
}