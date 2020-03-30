nrecovered = document.getElementById("nrecovered");
nhealthy = document.getElementById("nhealthy");
nsick = document.getElementById("nsick");

//main canvas
canvas = document.getElementById("maincanvas");
context = canvas.getContext("2d");

//canvas2
canvas2 = document.getElementById("secoundcanvas");
context2 = canvas2.getContext("2d");

sim = new Simulator();
sim.mode = "free";
vis = new Visualizator();

sim.startPopulation();
window.requestAnimationFrame( function(){ sim.loop(sim) } );
