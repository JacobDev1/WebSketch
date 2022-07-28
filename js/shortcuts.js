document.onkeydown = function(e){
    var e = e || window.event;
    switch(e.which){
        case 69:
            toggleEraser();
            break;
        case 49:
            updateBrushInOrder(0);
            break;
        case 50:
            updateBrushInOrder(1);
            break;
        case 51:
            updateBrushInOrder(2);
            break;
        case 52:
            updateBrushInOrder(3);
            break;
        case 53:
            updateBrushInOrder(4);
            break;
        case 80:
            document.querySelector("#color_picker").click();
            break;
        }
        
        if(e.ctrlKey){
            e.preventDefault();
            switch(e.which){
                case 83:
                    saveCanvas();
                    break;
                    case 79:
                        document.getElementById('fileinput').click();
                        break;
                    case 88:
                        clearCanvas();
                        break;
                    }
            }
}