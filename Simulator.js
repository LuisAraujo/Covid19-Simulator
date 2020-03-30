class Simulator{

	constructor(){
		//array of person
		this.population = new Array();
		//max size population
		this.sizepopulation = 200;	
		//velocity of people mov
		this.velocity = 3;

		this.hours = 0;
		this.currentIndex = 0;

		//controlling current datas
		this.qtdinfecteds = 0;
		this.qtdrecovered =0;

		//save historic
		this.arrayQtdinfecteds = new Array();
		this.arrayQtdrecovered = new Array();

		//free, severe, moderate ...
		this.mode = "moderate";
		
		//elements html			
		this.controlHours = window.setInterval( function(){
			sim.hours++;
			sim.arrayQtdinfecteds[sim.currentIndex++ ] = sim.qtdinfecteds;
			sim.arrayQtdrecovered[sim.currentIndex++ ] = sim.qtdrecovered;
		}, 30);
		
	}//end constructor
	
	startPopulation(){
		
		for(var i=0; i < this.sizepopulation; i++){
			this.population.push( new Person() );
			
			
			if(this.mode == "severe")
			//severe isolation;
			if(Math.random() < 0.95){
				this.population[i].quarantine = true;
			}
			
			if(this.mode == "moderate")
			//moderate isolation
			if(Math.random() < 0.4){
				this.population[i].quarantine = true;
			}
		}

		
		this.population[0].startCOVID();
		this.population[0].quarantine= false;
		
	};

	loop(_this){
		
		vis.printDataDOM();
		
		vis.printPersonCanvas();
		
		vis.printDataCanvas();
		
		if(_this.sizepopulation != _this.qtdrecovered){
			
			window.setTimeout( function() {requestAnimationFrame( 
				
				function(){
					_this.loop(_this); 
				}
			
			)}, 
			1000/60);
		
		}else{
			
			_this.restartSimulator();			
			window.setTimeout( function(){ alert("Thanks for visit. Stay in Home!")}, 100);
		
		}
	}

	restartSimulator(){
		
		this.qtdrecovered = this.sizepopulation;
		this.qtdinfecteds = 0;
		//restart
		for(i=0; i < this.sizepopulation; i++)
			population[i].level = 0;
		
		printPersonCanvas();
	}

}