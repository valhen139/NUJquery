
$(function () {
    initGame()

});
 
 var arrayElim = new Array() //Array que guarda elementos a eliminar
 var tableroListo = false //indica si el tabler esta listo despues del escaneo
 var score = 0   
 var movs = 0
//funcion de generacion de numeros aleatorios
function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};
//funcion para llenar el tablero 
function fillBoard() {
    
    for (i = 1; i < 8; i++) {
        for (s = 1; s < 8; s++)
            $(".col-" + i).append('<img class="elemento" src="./image/' + getRandom(1, 5) + '.png" id="col-' + i + '-row-' + s + '"/>')
    }


};

//funcion para cambiar el estilo del titulo permanentemente
function cambiaEstiloTitulo() {
    setInterval(function () {
        $('h1').toggleClass('alter-titulo');
        setTimeout(function () {
            $('h1').toggleClass('alter-titulo');
        }, 1000)

    }, 2000)
};

//aumenta el score dependiendo de la cantidad de elementos eliminados
function setScore(numElements) {
    switch (numElements) {
        case 3:
            score += 2;
            break;
        case 4:
            score += 4;
            break;
        case 5:
            score += 8;
            break;
        case 6:
            score += 15;
            break;
        case 7:
            score += 30;
    }
    $('#score-text').text(score);
}


//elimina elementos almacenados en el array
function elimArrayElements(elements) {
    for (t = 0; t < elements; t++) {
        $('#' + arrayElim[t]).hide(1000, function () { $(this).remove(); });
    }
   setScore(arrayElim.length)
    arrayElim.splice(0, elements)
    
};

//funcion para escanear todo el tablero buscando dulces iguales
function fullScanBoard() {
    //tableroListo = true
    var elements = 0
    for (a = 1; a < 8; a++) {
        for (b = 1; b < 8; b++){
            scanElement(a, b)
            elements = arrayElim.length
            if (elements >= 3) {
                tableroListo = false
                elimArrayElements(elements)
                elements=0
            }
        }
        
    }

};

//funcion para rellenar el tablero 
function reFillBoard() {

    var length
    for (i = 1; i < 8; i++) {
        length = $(".col-" + i).children().length;
        if (length < 7) {
            for (s = length; s < 7; s++) {
                $(".col-" + i + ":first").prepend('<img class="elemento ui-draggable ui-draggable-handle ui-droppable" src="./image/' + getRandom(1, 5) + '.png" id="col-' + i + 'i-row-' + s + 'i" style="position: relative;"/>')
            }
        };
        $(".col-" + i + " img:first").attr("id", 'col-' + i + '-row-1').next().attr("id", 'col-' + i + '-row-2').next().attr("id", 'col-' + i + '-row-3').next().attr("id", 'col-' + i + '-row-4').next().attr("id", 'col-' + i + '-row-5').next().attr("id", 'col-' + i + '-row-6').next().attr("id", 'col-' + i + '-row-7')
    }
    makeDragDrop()

};
function scanElement(col, row) {
  
    var imageScan
    var count = 0
    var image = $('#col-' + col + '-row-' + row).attr('src');
    //scan columna
    if (7 - row >= 2) {
        for (r = row; r < 8; r++) {
            imageScan = $('#col-' + col + '-row-' + r).attr('src');
            if (imageScan == image) {
                //agrega dulce al array de eliminacion
                arrayElim[count] = 'col-' + col + '-row-' + r
                count++
            } else {
                break;
            }
        }
    }
    count = 0
    //scan fila
    if (7 - col >= 2) {
        for (c = col; c < 8; c++) {
            imageScan = $('#col-' + c + '-row-' + row).attr('src');
            if (imageScan == image) {
                //agrega dulce al array de eliminacion
                arrayElim[count] = 'col-' + c + '-row-' + row
                count++
            } else {
                break;
            }
        }
    }
};

//cambia tablero al terminar el tiempo
function endGame() {
    $('div.panel-tablero, div.time').effect('fold');
    $('h1.main-titulo').addClass('title-over')
        .text('¡Muchas gracias por jugar!');
    $('div.score, div.moves, div.panel-score').width('100%');
}

//deshabilita eventos de elementos
function disableElementsEvents() {
    $('img').draggable('disable');
    $('img').droppable('disable');
}
//habilita eventos de elementos
function enableElementsEvents() {
    $('img').draggable('enable');
    $('img').droppable('enable');
}
//Intercambia elementos en el momento del drag & Drop
function swapElements(event, elementDrag) {
    var elementDrag = $(elementDrag.draggable);
    var dragSrc = elementDrag.attr('src');
    var elementDrop = $(this);
    var dropSrc = elementDrop.attr('src');
    elementDrag.attr('src', dropSrc);
    elementDrop.attr('src', dragSrc);
    movs++
    $('#movimientos-text').text(movs);

    automaticScanAndElim()
}

//escanea todo el tablero y elimina elementos
function automaticScanAndElim(){
    var loops = 0
    disableElementsEvents()
    tableroListo = true
    var interval = setInterval(function () {
        tableroListo = true
        loops++
        console.log(loops)
        fullScanBoard()
        console.log('tablero listos: ' + tableroListo)
        if (tableroListo) {
            console.log("entro al clear")
            clearInterval(interval)
        }
        setTimeout(
            function () {
                reFillBoard()
            }, 1000
        )
    },1000)
    //enableCandyEvents()
}

//Valida que al arrastrar son se haga en una posicion a cualquier lado
function dragValidations(event, elementDrag) {

    if (elementDrag.position.top<0){
        elementDrag.position.top = Math.max(-100, elementDrag.position.top);
    } else{
        elementDrag.position.top = Math.min(100, elementDrag.position.top);
    }
    if (elementDrag.position.left<0){
        elementDrag.position.left = Math.max(-100, elementDrag.position.left);
    }else{
        elementDrag.position.left = Math.min(100, elementDrag.position.left);
    }
}
//hace a los elementos arrastrables
function makeDragDrop() {
    
    $('img').draggable({
        containment: '.panel-tablero',
        droppable: 'img',
        revert: true,
        revertDuration: 200,
        grid: [100, 100],
        drag: dragValidations
        
    });
    $('img').droppable({
        drop: swapElements
    });
    enableElementsEvents();
}

//Inicializa Juego
function initGame(){
    cambiaEstiloTitulo()
    
    $('.btn-reinicio').on('click', function(){
        if ($(this).text() === 'Reiniciar') {
            location.reload(true);
        }
        $(this).text('Reiniciar');
        automaticScanAndElim()
        $('.timer').startTimer({ onComplete: endGame });
    })
    
    fillBoard()
    makeDragDrop()
    disableElementsEvents()
}


