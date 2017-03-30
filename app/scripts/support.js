'use strict';

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

function checkSameType(cards) {
    var firstCardColor = cards[0].target.fill();
    var secondCardColor = cards[1].target.fill();

    if (firstCardColor === secondCardColor) {
        return true;
    }
}

function destroy(cards) {
    cards[1].target.destroy();
    layer.draw();
    cards[0].target.destroy();
    layer.draw();
    return this;
}