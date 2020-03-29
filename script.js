canvas = document.getElementById("maincanvas");
context = canvas.getContext("2d");
levels = ["#ddd", "#f33", "#ff66ff"];
window.directions = ["right", "left", "up", "down", "right-up","right-down", "left-down", "left-up"];
velocity = 3;
hours = 0;
qtdinfecteds = 0;
qtdrecovered =0;


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
		this.x = parseInt( Math.random() * 480) + 10;
		this.y = parseInt( Math.random() * 480) + 10;
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
			
		}else if(this.x > 500){

			this.changeDirection();
			this.x -= 10;
			
		}else if(this.y < 0){
		
			this.changeDirection();
			this.y +=10;
		
		}else if(this.y > 500){
			
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
sizepopulation = 100;

for(i=0; i < sizepopulation; i++)
	population.push( new Person() );

population[0].startCOVID();
lastday = 0;
currentday = 0;

function loop(){
	
	/*x = 100
	y = ?
	
	y*100 = x * ?
	y*100/x = ?*/
	
	
	
	
	context.clearRect(0,0,500,500);
	
	var changeday = false;
	if(lastday != currentday){
		changeday = true;
		lastday = currentday;
		
		console.log("Day: " + currentday )
		console.log("Infected: "+ qtdinfecteds * 100/ sizepopulation + " %"  )
		console.log("Recovered: "+ qtdrecovered * 100/ sizepopulation + " %" )
		
	}
	
	
	//console.log(day);
	for(i=0; i < sizepopulation; i++){
		population[i].print(context);
		population[i].mover();
		
		if(changeday)
			population[i].addDay();

	}
	
	
	window.setTimeout( function() {
	requestAnimationFrame(loop)}
	, 1000 / 60 );
	
	
}

window.setInterval( function(){
	hours++;
	//console.log(hours, hours/24);
	currentday = parseInt( hours/ 60 ) ;
}, 10);


window.requestAnimationFrame(loop);
