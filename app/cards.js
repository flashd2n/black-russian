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
const actualColors = [];

let xOffset = 0;

const colorsWhichAreSelected = [];

function getRandomColor() {
    let availableColors = colors.length - 1;
    let currentColor = colors[Math.round(Math.random() * availableColors)];
    if (colorsWhichAreSelected.indexOf(currentColor) < 0) {
        colorsWhichAreSelected.push(currentColor);
    }
    else {
        colors.splice(colors.indexOf(currentColor));
    }
    return currentColor;

}

//* EASY NORMAL HARD difficulty

$(document).ready(function () {
    const $easy = $('.easy');
    const $normal = $('.normal');
    const $hard = $('.hard');

    let clicked = false;

    $easy.click(function () {
        if (clicked === false) {
            let items = 16;
            let cardColors = generateRandomColorsArr(items);
            initiateField(16, cardColors);
            clicked = true;
        }
    });
    $normal.click(function () {
        if (clicked === false) {
            let items = 42;
            let cardColors = generateRandomColorsArr(items);
            initiateField(42, cardColors);
            clicked = true;
        }
    });
    $hard.click(function () {
        if (clicked === false) {
            let items = 84;
            let cardColors = generateRandomColorsArr(items);
            initiateField(84, cardColors);
            clicked = true;
        }
    });
});

function generateRandomColorsArr(count) {

    let cardColors = [];

    for (let i = 0; i < count / 2; i += 1) {
        let rndIndex = Math.floor(Math.random() * colors.length);
        cardColors.push(colors[rndIndex]);
        cardColors.push(colors[rndIndex]);
    }

    return cardColors;
}




function initiateField(items, cardColors) {

    let rows = 0;
    xOffset = 0;

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

    setTimeout(function () {

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

function startGame() {

    let startTimer = new Date();

    layer.on('mouseover', function (event) {

        event.target.tween.play();

    });

    layer.on('mouseout', function (event) {

        event.target.tween.reverse();

    });


    layer.on('click tap', function (evt) {
        const shapes = stage.find('Rect');

        // if card is flipped face-down
        if (evt.target.fill() === 'gray') {
            evt.target.fill(actualColors[evt.target.id()]);
        }

        writeMessage('Selected card is ' + evt.target.fill() + ' with ID ' + evt.target.id());

        storeCards(evt);
        if (isSecond()) {

            if (checkSameType(cards) && !checkIfFlipped(cards)) {

                if (shapes.length === 2) {

                    gameEnd(startTimer);

                }

                destroy(cards);
            }
            else {
                shapes.each(function (shape) {
                    shape.fill('gray');
                });
            }
            cards.splice(0, cards.length);
        }
    });
}

function gameEnd(startTimer) {
    let currentTime = new Date();
    let endTimerInSeconds = (currentTime - startTimer) / 1000;
    let timeToComplete = Math.round(endTimerInSeconds * 100) / 100;

    writeMessage('Time: ' + timeToComplete + 'seconds');
}


//write message function
function writeMessage(message) {
    text.setText(message);
    layer.draw();
}

function checkIfFlipped(cards) {
    var firstCardColor = cards[0].target.id();
    var secondCardColor = cards[1].target.id();

    if (firstCardColor === secondCardColor) {
        return true;
    }
}

//switches every even click on a different card
var isSecond = (function () {
    var called = true;
    return function () {
        if (called === true) {
            called = false;
        } else {
            called = true;
        }
        return called;
    };
})();

//function to store two cards

function storeCards(card) {
    cards.push(card);

}


//function to check if cards are the same type
function checkSameType(cards) {
    var firstCardColor = cards[0].target.fill();
    var secondCardColor = cards[1].target.fill();

    if (firstCardColor === secondCardColor) {
        return true;
    }
}

//destroy cards

function destroy(cards) {
    cards[1].target.destroy();
    layer.draw();
    cards[0].target.destroy();
    layer.draw();
    return this;
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