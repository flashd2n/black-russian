'use strict';

function startGame() {

    let startTimer = new Date();

    layer.on('mouseover', function(event) {
        event.target.tween.play();

    });

    layer.on('mouseout', function(event) {

        event.target.tween.reverse();

    });


    layer.on('click tap', function(evt) {
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

            } else {
                shapes.each(function(shape) {
                    shape.fill('gray');
                });
            }
            cards.splice(0, cards.length);
        }
    });
}

function storeCards(card) {
    cards.push(card);
}

function gameEnd(startTimer) {
    let currentTime = new Date();
    let endTimerInSeconds = (currentTime - startTimer) / 1000;
    let timeToComplete = Math.round(endTimerInSeconds * 100) / 100;
    console.log(timeToComplete);
    writeMessage('Time: ' + timeToComplete + 'seconds');

    Begin();
    startGame();
}