//Declarations
var canvas = document.querySelector('#board');
var ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 600;

if(window.innerWidth <= 1024)
{
    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 350;
    
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
    }
}

ctx.lineJoin = ctx.lineCap = 'round'; 
var is_drawing, points = [ ], smoothing_on = true, is_erasing = false;

clearCanvas();
updateColor();

//Drawing Implementation
var Device = {
    PC: 0,
    Mobile: 1,
    GraphicTablet: 2,
};

function midPointBtw(p1, p2) {
    return {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
    };
}

function drawingMove(e, device){
    if (!is_drawing) return;

    switch(device){
        case Device.PC:{
            points.push({ x: e.offsetX, y: e.offsetY });
            switch(e.buttons){
                case 1:
                    updateColor();
                    break;
                }
            break;
        }
        case Device.Mobile:{
            var rect = e.target.getBoundingClientRect();
            points.push({ x: e.targetTouches[0].pageX - rect.left, y: e.targetTouches[0].pageY - rect.top    });
            updateColor();
            break;
        }
        case Device.GraphicTablet:{
            if(e.pressure == 0){
                is_drawing = false;
                points.length = 0;
            }else{
                var rect = canvas.getBoundingClientRect();
                points.push({ x: e.clientX - rect.left, y: e.clientY - rect.top  });
            }
            updateColor();
            break;
        }
    }

    if(is_erasing){
        ctx.strokeStyle = "white";
        ctx.lineWidth = document.querySelector("#brush_size").value * 3;
    }else
        updateBrush();
    
    var p1 = points[0];
    var p2 = points[1];
    
    ctx.beginPath();
    
    if(device != Device.GraphicTablet)  //Bugfix
        ctx.moveTo(p1.x, p1.y);

    for (var i = 1, len = points.length; i < len; i++) {
        if(smoothing_on){
            var midPoint = midPointBtw(p1, p2);
            ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
        }else{
            ctx.lineTo(p1.x, p1.y);
        }
        p1 = points[i];
        p2 = points[i+1];
    }
    
    if(!smoothing_on)
        ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
}

//GUI
canvas.onmousedown = function(e) {
    is_drawing = true;
    points.push({ x: e.offsetX, y: e.offsetY });
}

canvas.ontouchstart = function(e) {
    is_drawing = true;
    var rect = e.target.getBoundingClientRect();
    points.push({ x: e.targetTouches[0].pageX - rect.left, y: e.targetTouches[0].pageY - rect.top    });
}

canvas.onpointerdown = function(e){
    is_drawing = true;
    var rect = canvas.getBoundingClientRect();
    points.push({ x: e.clientX - rect.left, y: e.clientY - rect.top  });
}

canvas.onmousemove = (e) => {
    drawingMove(e, Device.PC);
} 

canvas.ontouchmove = (e) => {
    drawingMove(e, Device.Mobile);
}

canvas.onpointermove = (e) => {
    drawingMove(e, Device.GraphicTablet);
}

canvas.onmouseup = onmouseout = ontouchcancel = ontouchend = function() {
    is_drawing = false;
    points.length = 0;
}

function clearCanvas(){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function saveCanvas(){
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = canvas.toDataURL("image/jpeg")
    a.download = "export.jpg";
    a.click();
    document.body.removeChild(a);   
}

function updateBrush(){
    ctx.lineWidth = document.querySelector("#brush_size").value;
}

function updateBrushInOrder(n){
    var brush = document.querySelector("#brush_size")[n];
    brush.selected = true;
    ctx.lineWidth = brush.value;
}

function updateColor(){
    ctx.strokeStyle = document.querySelector("#color_picker").value;
}

// function updateSmoothing(){
//     smoothing_on = parseInt(document.querySelector("#smoothing").value);

// }

// function toggleSmoothing(){
//     smoothing_on = !smoothing_on;

//     smoothing = document.querySelector("#smoothing");
//     if(smoothing_on)
//         smoothing.classList.add("button_on");
//     else
//         smoothing.classList.remove("button_on");
// }

function toggleEraser(){
    is_erasing = !is_erasing;
    var eraser = document.querySelector("#eraser");
    if(is_erasing)
        eraser.classList.add("button_on");
    else
        eraser.classList.remove("button_on");

}
let fileInput = document.getElementById('fileinput');
fileInput.addEventListener('change', function(ev) {
    if(ev.target.files) {
        let file = ev.target.files[0];
        var reader  = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function (e) {
            var image = new Image();
            image.src = e.target.result;
            image.onload = function(ev) {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image,0,0,);
            }
        }
    }
    fileInput.value = "";
});