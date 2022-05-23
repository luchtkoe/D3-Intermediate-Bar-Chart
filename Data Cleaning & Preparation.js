// Returns a csv from an array of objects with
// values separated by tabs and rows separated by newlines
function CSV(array) {
    // Use first element to choose the keys and the order
    var keys = Object.keys(array[0]);

    // Build header
    var result = keys.join(",") + "\n";

    // Add the rows
    array.forEach(function(obj){
        result += keys.map(k => obj[k]).join(",") + "\n";
    });
    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff", result]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "data.csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    console.log(result)
    return result;
}
//LOADING DATA
d3.csv('1. Total Population Annual.csv').then(function(data){

// NEEDED FUNCTIONS
// DATA WRANGLING
  var urbanPopulation = []; // Empthy array to put transformed data in

  // Loop through every Object in the array
  data.forEach((row, j) => {                                                    // Every object represents a region/country
      for(var key in row){                                                      // Loop through every key value pair in the object
        // Transform every key that represents a year into a individual object.
        if(key !== "Region" && key !== "Countrycode" && key !== "Index" && key !== "Note" && key !== ""){         // If that selects only key that represent a year.
          var obj = {};                                                         // Empthy object to store new individual key value pairs

          // Create Object
          // Structure {region: 'Indonesia', countryCode: 999, year: 2020, note:'', urbanPopulation: 12345687}
          obj.region = row.Region;                              	              // Select {country} key:region
          obj.countryCode = Number(row.Countrycode);            	              // Select {country}  key:Countrycode
          obj.year =key;                               	                        // Select key transform to integer
          obj.note = row.Note;                                  	              // Select {country} key:Note
          obj.population = Number(row[key]) * 1000;        	              // Select Object key its value multiply by 1000 (csv data in in thousands)
          urbanPopulation.push(obj)                             	              // push obj to array
        }
        // Next key
      }
      // End for loop
    });
    CSV(urbanPopulation)
})
