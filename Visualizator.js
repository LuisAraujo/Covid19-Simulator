class Visualizator{
	
	constructor(){
		this.canvas = null;
		this.canvas2 = null;
		this.context = null;
		this.context2 = null;
	}
		
	printPersonCanvas(){
		
		context.clearRect(0,0,canvas.width,canvas.height);
		
		for(var i=0; i < sim.sizepopulation; i++){
			sim.population[i].print(context);
			sim.population[i].mover();
			
			//if(changeday)
			sim.population[i].addDay();

		}
	}

	printDataDOM(){
		
		nrecovered.innerHTML = sim.qtdrecovered * 100/ sim.sizepopulation + " %" 
		nsick.innerHTML = sim.qtdinfecteds * 100/ sim.sizepopulation + " %" 
		nhealthy.innerHTML = (sim.sizepopulation - (sim.qtdinfecteds + sim.qtdrecovered)) * 100/ sim.sizepopulation + " %" ;
	}


	printDataCanvas(){
		
		context2.fillStyle = "#79a6d2";
		context2.fillRect(0,0, canvas.width,canvas.height);
		
		for(var i = 0; i < sim.arrayQtdinfecteds.length; i++){
			context2.fillStyle = "#cc2900";
			
			context2.fillRect( i/4, 100 - ( sim.arrayQtdinfecteds[i] * 100/ sim.sizepopulation), 1 , 
			(sim.arrayQtdinfecteds[i] * 100/ sim.sizepopulation) );
			
			context2.fillStyle = "#ff66ff";
			context2.fillRect( i/4, 0, 1 , (sim.arrayQtdrecovered[i] * 100/ sim.sizepopulation) );
			
			//arrayQtdrecovered[i];
		}
		
	}

}