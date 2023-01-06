function btnClick() {
    Tone.start();
    console.log('clicked');
    Tone.Transport.start();
    Tone.Transport.bpm.rampTo(800, 10);
}

Tone.Transport.schedule((time) => {
	// invoked on measure 16
	console.log("measure 16!");
}, "1.2");

function dataToToneSchedule(data, options = null) { /**
    (list of objects, objects) -> list of objects
    Args:
        -data: either:
            - a list of objects of the form {categorical_variable_name: 'categorical identifier',  time_variable_name: 'time', value_variable_name: 'value'}
            - a list of lists of form [categorical_var, time(numeric) value (numeric)]
        -options, object with optional values
            - duration, numeric: seconds in which the audio representation must take place
            - gain_range, [numeric, numeric] both in range [0,1]: the maximum and minimum volumes
            - pitches: list of strings e.g. ['C4', 'A5', 'E5'] or object of form {'categorical identifier':'pitch'} 
            - categorical_variable_name, value_variable_name, time_variable_name: strs, the names of the fields representing magnitude, time and category
            - time_scale: function taking arguments (value, domain[min, max], duration) returning a time offset in seconds determining when the event is represented
            - volume_scale: function taking arguments (value, domain[min, max]) returning a volume from 0,1
    Returns:
        - an array of objects with keys 'time', 'pitch', and 'volume'
            */
    default_options = {
        "duration": 60,
        "gain_range": [
            0.2, 1
        ],
        "cateogrical_variable_name": "category",
        "time_variable_name": "time",
        "value_variable_name": "value",
        'pitches': ['C4', 'D4', 'E4', 'G4', 'A5', 'C5', 'D5', 'E5', 'G5', 'A5'],
        "volume_scale" : function(value, domain, gain_range){
            return (gain_range[0]+ ((value-domain[0])/(domain[1]-domain[0]))*(gain_range[1]-gain_range[0]))
        },
        "time_scale" : function(value, domain, duration){
            return (((value-domain[0])/(domain[1]-domain[0]))*duration)
        }
    };
    options = {
        ...default_options,
        ... options
    };
    // if we have a list of lists, we want to remap to a list of objects, and if we have a list of objects, we want to rename the keys for ease
    if (data[0] instanceof Array) {
        data = data.map(([category, time, value]) => ({category, time, value}));
        // Get all our cateogrical_identifiers from the data
    } else { // rename our categorical variable and value variable names to 'category' and 'value'
        data = data.map(obj => {
            return {
                category: obj[options["categorical_variable_name"]],
                time: obj[options["time_variable_name"]],
                value: obj[options["value_variable_name"]]
            };
        });
    }

    // if we just have a list of strings for the pitches, we want to redo in the form {'category': 'string}
    if(typeof options.pitches[0] === "string"){
        const categories = [...new Set(data.map(item => item.category))];
        options.pitches = options.pitches.slice(0,categories.length); //we want only as many pitches as categories    
        pitches = {};
        categories.forEach((category, i) => pitches[category]=options.pitches[i]);
        options.pitches = pitches;
        //options.pitches = options.pitches.map((e, i) => [categories[i] ,e])
    }

    // Get the max and min positions and value
    value_max = Math.max(... data.map(obj => obj.value));
    value_min = Math.min(... data.map(obj => obj.value));
    time_max = Math.max(... data.map(obj => obj.time));
    time_min = Math.min(... data.map(obj => obj.time));


    // map our data to a tone schedule
    tone_schedule = data.map(event => {
        return({
            time: options.time_scale(event.time, [time_min,time_max], options.duration),
            pitch: options.pitches[event.category],
            volume: options.volume_scale(event.value, [value_min, value_max], options.gain_range)
        })
    });

    return tone_schedule
    //return([options, data]);
}


console.log(dataToToneSchedule(
    [["cat1",0,1],["cat2",0.25,7],["cat1",1.2,0],["cat3",2,11]],
    options = {
        "pitches" : ['X', 'Y', 'Z']
    }
));

console.log(dataToToneSchedule(
    [{'cat': 'cat1', 'pos': 0, 'val': 1}, {'cat': 'cat2', 'pos': 0.25, 'val': 7}, {'cat': 'cat1', 'pos': 1.2, 'val': 0}, {'cat': 'cat3', 'pos': 2, 'val': 11}],
    {
        "categorical_variable_name" : "cat",
        "time_variable_name" : "pos",
        "value_variable_name" : "val"
    }
));

f = dataToToneSchedule(
    [{'cat': 'cat1', 'pos': 0, 'val': 1}, {'cat': 'cat2', 'pos': 0.25, 'val': 7}, {'cat': 'cat1', 'pos': 1.2, 'val': 0}, {'cat': 'cat3', 'pos': 2, 'val': 11}],
    {
        "categorical_variable_name" : "cat",
        "time_variable_name" : "pos",
        "value_variable_name" : "val"
    }
);