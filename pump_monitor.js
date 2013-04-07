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

function ts() {
//  var now = new Date();
//  var jsonDate = now.toJSON();
//  return jsonDate;
    return Date.now();
};


console.log(ts()+':Start');

pump.watch(function (err, value) {
  var state;
    if (err) throw err;
    state = pump.readSync(); 
    if(state == 1){
      power_start = Date.now();
      console.log(ts() + ':on');
    } else {
      power_stop  = Date.now();
      console.log(ts() + ':off');
    }
     
//    button.unexport(); // Unexport GPIO and free resources
});

//time out runaway or failed pump
setInterval(function() {
   now = Date.now();
   state = pump.readSync(); 
   if((state == 1) && ((now - power_start) > 10.0*60.0*1000.0)) { //pump on for > 10 minutes
      console.log(ts()+":alarm running for " + ((now - power_start)/60000.0).toFixed(2) + " minutes");
   };

   if((state == 0 ) && ((now - power_stop) > 240.0*60.0*1000.0)) { // pump off for > 4 hours
      console.log(ts()+":alarm off for " + ((now - power_stop)/(60000.0)).toFixed(2) + " minutes");
      power_stop = Date.now();
   }

}, 60.0*1000.0*1.0); // once per minute

