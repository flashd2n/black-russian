"use strict";
var stage = new Konva.Stage({
    container: 'canvas',
    width: 1600,
    height: 2000
});

var layer = new Konva.Layer();
var text = new Konva.Text({
    x: 10,
    y: 10,
    fontFamily: 'Calibri',
    fontSize: 20,
    text: '',
    fill: 'black'
});

var colors = ["pink", "yellow", "green", "orange", "blue", "red"];
var actualColors = [];

var startTimer;
let xOffset = 0;

var colorsWhichAreSelected = [];
function getRandomColor() {
    var availableColors = colors.length - 1;
    var currentColor = colors[Math.round(Math.random() * availableColors)];
    if (colorsWhichAreSelected.indexOf(currentColor) < 0) {
        colorsWhichAreSelected.push(currentColor);
    }
    else {
        colors.splice(colors.indexOf(currentColor));
    }
    return currentColor;

}


//* EASY NORMAL HARD difficulty
var items = 0;

$(document).ready(function () {
    var $easy = $('.easy');
    var $normal = $('.normal');
    var $hard = $('.hard');

    var clicked = false;

    //* TO DO: change ITEMS values for final version

    $easy.click(function () {
        if (clicked === false) {
            items = 15;
            console.log(items);
            createObjects(items);
            clicked = true;
        }
    });
    $normal.click(function () {
        if (clicked === false) {
            items = 42;
            console.log(items);
            createObjects(items);
            clicked = true;
        }
    });
    $hard.click(function () {
        if (clicked === false) {
            items = 84;
            console.log(items);
            createObjects(items);
            clicked = true;
        }
    });
});

//* > added var Items to the total amount of shapes in the game*/
//* > everything was added to a function */


function generateRandomColorsArr(count) {
    let cardColors = [];

    for (let i = 0; i < count / 2; i += 1) {
        let rndIndex = Math.floor(Math.random() * colors.length);
        cardColors.push(colors[rndIndex]);
        cardColors.push(colors[rndIndex]);
    }

    // console.log(cardColors);

    return cardColors;
}

function createObjects(items) {
    let cardColors = generateRandomColorsArr(items);
    let rows = 0;
    var currentCard;


    xOffset = 0;
    for (var i = 0; i < items; i += 1) {
        let randomColorIndex = Math.floor(Math.random() * cardColors.length);
        let realColor = cardColors[randomColorIndex];
        cardColors.splice(randomColorIndex, 1);


        if (i % 10 === 0 && i !== 0) {
            ++rows;
        }
        currentCard = createCard(realColor, i, rows);

        actualColors.push(realColor);

        layer.add(currentCard);

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
        }
        layer.add(text);
        stage.add(layer);

        startTimer = new Date();




        layer.on("click tap", function (evt) {
            var shapes = stage.find('Rect');

            // if card is flipped face-down
            if (evt.target.fill() === 'gray') {
                evt.target.fill(actualColors[evt.target.id()]);
            }

            writeMessage('Selected card is ' + evt.target.fill() + " with ID " + evt.target.id());

            storeCards(evt);
            if (isSecond()) {

                if (checkSameType(cards) && !checkIfFlipped(cards)) {

                    if (shapes.length === 2) {
                        let currentTime = new Date();
                        let endTimerInSeconds = (currentTime - startTimer) / 1000;
                        let timeToComplete = Math.round(endTimerInSeconds * 100) / 100;

                        writeMessage('Time: ' + timeToComplete + 'seconds');
                    }



                    destroy(cards);
                }
                else {
                    shapes.each(function (shape) {
                        shape.fill('gray');
                    });
                }
                cards = [];
            }

            //removeCards(evt.target);

        });


    }, 1000);



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
    var cards = [];

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