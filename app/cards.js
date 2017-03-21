
var stage = new Konva.Stage({
    container: 'canvas',
    width: 1600,
    height: 350
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

var colors = ["pink", "yellow", "green", "orange", "blue","red"]

function getRandomColor() {
    var availableColors = colors.length-1;
    return colors[Math.round(Math.random() * availableColors)];
}

for (var i = 1; i <= 10; i += 1) {
    var names = []
    names[i-1] = "shape" + i;
     names[i-1] = new Konva.Rect({
        x: (120 * i) + 20,
        y: 30,
        fill: getRandomColor(),
        width: 100,
        height: 180,
        id: i
    });
    layer.add(names[i-1]);
   
}


layer.on("click tap", function (evt) {

    //alert(evt.target.getId())
    writeMessage('Selected card is ' + evt.target.fill() + " with ID " + evt.target.id());


    storeCards(evt);
    if (isSecond()) {
        // alert(cards[0].target.getId() + ' ' + cards[1].target.getId());
        if (checkSameType(cards) && !checkIfFlipped(cards)) {
            destroy(cards)
        }
        cards = [];
    }

    //removeCards(evt.target);

});


//write message function
function writeMessage(message) {
    text.setText(message);
    layer.draw();
}

//function to check if current card is already flipped

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
        }
        else {
            called = true;
        }
        return called;
    }
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




layer.add(text);
 stage.add(layer);
