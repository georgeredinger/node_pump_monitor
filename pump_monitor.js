var Gpio = require('onoff').Gpio,    
    pump = new Gpio(18, 'in', 'both',{
             debounceTimeout:500,
             persistentWatch:true
    }), 
    pump_off = new Gpio(18, 'in', 'falling',{
             debounceTimeout:500,
             persistentWatch:true
    }),
    power_start=Date.now(),
    power_stop =Date.now(); 

console.log('Start');

pump.watch(function (err, value) {
  var state;
    if (err) throw err;
    state = pump.readSync(); 
    if(state == 1){
      power_start = Date.now();
      console.log('off for '+(power_start-power_stop)/1000.0);
    } else {
      power_stop  = Date.now();
      console.log('on for '+(power_stop-power_start)/1000.0);
    }
    console.log('Pump ' + state);
     
//    button.unexport(); // Unexport GPIO and free resources
});

//time out runaway or failed pump
setInterval(function() {
   now = Date.now();
   state = pump.readSync(); 

   if((state == 1) && ((now - power_start) > 10.0*60.0*1000.0) { //pump on for > 10 minutes
      console.log("timeout running for " + (now - power_start)/60000.0 + " minutes");
   };

   if((state == 0 ) && ((now - power_stop) > 60.0*60.0*1000.0)) { // pump off for > 1 hour
      console.log("timeout off for " + (now - power_stop)/(60000.0) + " minutes");
   }

}, 10000);

