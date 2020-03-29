//global vars
levels = ["#79a6d2", "#cc2900", "#ff66ff"];
window.directions = ["right", "left", "up", "down", "right-up","right-down", "left-down", "left-up"];
velocity = 3;
hours = 0;

//controlling datas
qtdinfecteds = 0;
qtdrecovered =0;

arrayQtdinfecteds = new Array(200);
arrayQtdrecovered = new Array(200);

for(var i = 0; i < 300; i++){
	arrayQtdinfecteds[i] = 0;
	arrayQtdrecovered[i] = 0;
}

//elements html
nrecovered = document.getElementById("nrecovered");
nhealthy = document.getElementById("nhealthy");
nsick = document.getElementById("nsick");
canvas = document.getElementById("maincanvas");
context = canvas.getContext("2d");


canvas2 = document.getElementById("secoundcanvas");
context2 = canvas2.getContext("2d");


window.requestAnimationFrame = (function(callback){	
   return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout( requestAnimationFrame(callback) , 2000 / 60);
        };
      })();



function getPixelXY(x, y) {
  var imgData = context.getImageData(0,0,canvas.width,canvas.height);
  var i = (y* imgData.width+x)*4, d = imgData.data;
  return [d[i],d[i+1],d[i+2],d[i+3]]
  
}




class Person{
	
	constructor(x, y){
		
		this.level = 0;
		this.x = parseInt( Math.random() * canvas.width - 20) + 10;
		this.y = parseInt( Math.random() * canvas.height - 20) + 10;
		this.size = 5;
		this.day = 0;
		this.infected = 0;
		this.recovered = 0;
	
		this.direction = directions[parseInt( Math.random() * directions.length)];
	}
	
	startCOVID(){
		
		if((this.infected == 0) && (this.recovered == 0)){
			this.infected = 1;
			this.level = 1;
			qtdinfecteds++;
		}
	}
	
	addDay(){
		
		if(this.infected == 1)
			this.day++;
		
		if(( this.day > 14) && (this.recovered == 0) ) {
			
			this.recovered = 1;
			this.infected = 0;
			this.level = 2;
			
			qtdinfecteds--;
			qtdrecovered++;
		}
	}
	
	print( ctx ){
		ctx.beginPath();
		ctx.strokeStyle = "#000";
		ctx.fillStyle = levels[this.level];
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();	
	}
	
	mover(){
		
		//getPixelXY(this.x, this.y);
		
		if(this.direction =="right"){
			this.x += velocity;
		}else if(this.direction =="left"){
			this.x -= velocity;
		}else if(this.direction =="up"){
			this.y -= velocity;
		}else if(this.direction =="down"){
			this.y += velocity;
		}else if(this.direction =="right-up"){
			this.x += velocity/2;
			this.y -= velocity/2;
		}else if(this.direction =="left-up"){
			this.x -= velocity/2;
			this.y -= velocity/2;
		}else if(this.direction =="right-down"){
			this.x += velocity/2;
			this.y += velocity/2;
		}else if(this.direction =="left-down"){
			this.x -= velocity/2;
			this.y += velocity/2;
		}
		
		this.verifyCollision();
	
	}
	
	verifyCollision(){
		
		//bound colision
		if(this.x < 0){
			this.changeDirection();
			this.x +=10;
			
		}else if(this.x > canvas.width){

			this.changeDirection();
			this.x -= 10;
			
		}else if(this.y < 0){
		
			this.changeDirection();
			this.y +=10;
		
		}else if(this.y > canvas.height){
			
			this.changeDirection();
			this.y -=10;
		}
		
		
		//colision with outher person
		for(var i = 0; i < sizepopulation; i++){
			if(this == population[i])
				continue;
			
			var dx = this.x - population[i].x;
			var dy = this.y - population[i].y;
			var distance = Math.sqrt(dx * dx + dy * dy);
		
			if (distance < this.size + population[i].size) {
				
				this.changeDirection();
				
				if( (this.level == 1) && (population[i].level == 0) )
				{	
					population[i].startCOVID();
				}
			}
		}	
		
	}
	
	
	changeDirection(){
		
		var olddirection = this.direction;
		
		while( olddirection == this.direction){
			this.direction = directions[parseInt( Math.random() * directions.length)];
		}
	}
	
}

population = new Array();
sizepopulation = 200;

for(i=0; i < sizepopulation; i++)
	population.push( new Person() );

population[0].startCOVID();
lastday = 0;
currentday = 0;

function loop(){
	
	nrecovered.innerHTML = qtdrecovered * 100/ sizepopulation + " %" 
	nsick.innerHTML = qtdinfecteds * 100/ sizepopulation + " %" 
	nhealthy.innerHTML = (sizepopulation - (qtdinfecteds + qtdrecovered)) * 100/ sizepopulation + " %" ;

	
	context.clearRect(0,0,canvas.width,canvas.height);
	
	var changeday = false;
	if(lastday != currentday){
		
		changeday = true;
		lastday = currentday;
		
	}
	
	
	for(i=0; i < sizepopulation; i++){
		population[i].print(context);
		population[i].mover();
		
		if(changeday)
			population[i].addDay();

	}
	
	printDataCanvas();
	
	
	window.setTimeout( function() {
	requestAnimationFrame(loop)}
	, 1000 / 60 );
	
	
}

function printDataCanvas(){
	
	context2.fillStyle = "#79a6d2";
	context2.fillRect(0,0, canvas.width,canvas.height);
	
	for(var i = 0; i < arrayQtdinfecteds.length; i++){
		context2.fillStyle = "#cc2900";
		context2.fillRect( i/4, 100 - arrayQtdinfecteds[i], 1 , arrayQtdinfecteds[i]);
		
		//context2.fillStyle = "#ff66ff";
		//context2.fillRect( i/4, 0, 1 , arrayQtdrecovered[i]);
		
		//arrayQtdrecovered[i];
	}
	
}
//controlling days
window.setInterval( function(){
	hours++;
	currentday = parseInt( hours/ 30 ) ;
}, 20);

currentIndex = 0;

window.setInterval( function(){
	arrayQtdinfecteds[currentIndex++ ] = qtdinfecteds;
	arrayQtdrecovered[currentIndex++ ] = qtdrecovered;
}, 30);


window.requestAnimationFrame(loop);
