function point(active){
	this.x;
	this.y;
	this.active = active;
}
function queue(){
	this.q = [];
	this.state = 0;
}
var prev = new point(false);
var q = new queue();
var can = document.getElementById("canvas");
can.width = window.innerWidth/2;
can.height = window.innerHeight/1.03;
var context = can.getContext('2d');
var clicking = false;
var color = "black";
var radius = 3;
$('#canvas').mousedown(function(event){
	prev.active = true;
	prev.x = event.pageX;
	prev.y = event.pageY;
});

$(document).mouseup(function(){
	prev.active = false;

});

$('#canvas').on( "mousemove", function(event) {
	if(prev.active == true){
    	context.beginPath();
			context.moveTo(prev.x, prev.y);
			context.lineTo(event.pageX, event.pageY);
			context.stroke();
			q.q.push({"action" : "drawLine", data : [prev.x, prev.y, event.pageX, event.pageY]});
			prev.x = event.pageX;
			prev.y = event.pageY;
	}
});
$('#text').bind('input propertychange', function(){
	q.q.push({"action" : "text", data : [$('#text').val()]});
});
var socket = io();
function send_data(){
	q.s = q.q.length - 1;
	if(q.s >= 0){
		var message = JSON.stringify(q.q.splice(0, q.s));
		socket.emit('draw message', message);
	}
	}
socket.on('draw message', function(msg){
	var message = JSON.parse(msg);
	for(var i = 0; i < message.length; i++){
		if(message[i].action == "drawLine"){
    		context.beginPath();
 			context.moveTo(message[i].data[0], message[i].data[1]);
  			context.lineTo(message[i].data[2], message[i].data[3]);
  			context.stroke();
  		}
  		else if(message[i].action == 'text'){
  			$('#text').val(message[i].data[0]);
  		}
	}
});
setInterval(send_data, 100);