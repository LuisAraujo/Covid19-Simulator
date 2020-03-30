class Person{
	
	constructor(x, y){
		
		//color of levels
		this.levels = ["#79a6d2", "#cc2900", "#ff66ff"];
		this.level = 0;
		this.x = parseInt( Math.random() * canvas.width - 20) + 10;
		this.y = parseInt( Math.random() * canvas.height - 20) + 10;
		this.size = 3;
		this.hours = 0;
		this.infected = 0;
		this.recovered = 0;
		//possible directions
		this.directions = ["right", "left", "up", "down", "right-up","right-down", "left-down", "left-up"];
		this.direction = this.directions[parseInt( Math.random() * this.directions.length)];
		this.quarantine = false;;
		
	}
	
	startCOVID(){
		
		if((this.infected == 0) && (this.recovered == 0)){
			this.infected = 1;
			this.level = 1;
			sim.qtdinfecteds++;
		}
	}
	
	addDay(){
		
		if(this.infected == 1)
			this.hours++;
		
		if(( this.hours/30 > 14 ) && (this.recovered == 0) ) {
			
			this.recovered = 1;
			this.infected = 0;
			this.level = 2;
			
			sim.qtdinfecteds--;
			sim.qtdrecovered++;
		}
	}
	
	print( ctx ){
		ctx.beginPath();
		ctx.strokeStyle = "#000";
		ctx.fillStyle = this.levels[this.level];
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();	
	}
	
	mover(){
		
		if(this.quarantine)
			return;
		
		if(this.direction =="right"){
			this.x += sim.velocity;
		}else if(this.direction =="left"){
			this.x -= sim.velocity;
		}else if(this.direction =="up"){
			this.y -= sim.velocity;
		}else if(this.direction =="down"){
			this.y += sim.velocity;
		}else if(this.direction =="right-up"){
			this.x += sim.velocity/2;
			this.y -= sim.velocity/2;
		}else if(this.direction =="left-up"){
			this.x -= sim.velocity/2;
			this.y -= sim.velocity/2;
		}else if(this.direction =="right-down"){
			this.x += sim.velocity/2;
			this.y += sim.velocity/2;
		}else if(this.direction =="left-down"){
			this.x -= sim.velocity/2;
			this.y += sim.velocity/2;
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
		for(var i = 0; i < sim.sizepopulation; i++){
			if(this == sim.population[i])
				continue;
			
			var dx = this.x - sim.population[i].x;
			var dy = this.y - sim.population[i].y;
			var distance = Math.sqrt(dx * dx + dy * dy);
		
			if (distance < this.size + sim.population[i].size) {
				
				this.changeDirection();
				
				if( (this.level == 1) && (sim.population[i].level == 0) )
				{	
					sim.population[i].startCOVID();
				}
			}
		}	
		
	}
	
	
	changeDirection(){
		
		var olddirection = this.direction;
		
		while( olddirection == this.direction){
			this.direction = this.directions[parseInt( Math.random() * this.directions.length)];
		}
	}
	
}