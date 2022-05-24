// RUNNING TIME
var startTime = performance.now()

// NEEDED VARIABLES
var height = 720;
var width = 1080;
var margin = {top:40, right:80, bottom:60, left:50};



// SELECTING HTML elements
var yearsDropdown = d3.select('#yearsDropdown');
var svg = d3.select("#dataVisualisation");

svg
  .attr('height', height)
  .attr('width', width)

var tooltip = d3.select("#charting")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px")
  .style("position", "absolute")
  ;

// PLOTTING & VISUALIZATION
function render(data){

// Required functions

  // Function to make large integers more readible
  var lineValueFormat = function(population){
    var population = population;

    if (population == 0) {
      return "0M"
    } else if (population >= 10000 && population < 100000 || population >= 10000000 && population < 100000000) {
      var format = d3.format(".3s")
      return format(population)
    } else if (population >= 100000 && population < 1000000 || population >= 100000000 && population < 1000000000) {
      var format = d3.format(".4s")
      return format(population)
    } else if (population >= 1000000000) {
      var format = d3.format(".2s")
      return format(population).replace("G", "B")
    }
    else{
      var format = d3.format(".2s")
      return format(population)
    }
  }

  // Function Scales
    // X Scale
  var xScale = d3.scaleBand()
    .range([margin.left, width - margin.right])
    .padding(0.2)
    ;
    // Y Axis
  var yScale = d3.scaleLinear()
    .range([height - margin.bottom, margin.top ])
    ;
  var colorScale = d3.schemeCategory10
  // Function Axis
    // X Axis
  var xAxis = d3.axisBottom()
    .scale(xScale)
    ;
    // Y Axis
  var yAxis = d3.axisLeft()
    .scale(yScale)
    ;

// Filling dropdown to select population by year
  // Array op year options
  var yearsMap = [...new Set(d3.map(data, (item) => item.year))];

  // Add options to dropdown element
  yearsDropdown
    .selectAll('option')
    .data(yearsMap)
    .join("option")
    .text((item) => item)
    .attr('value', (item) => item)
    .attr('class', (item) => "year"+item)
    ;

// Create containers for visualisations
  // Bar Container
  svg
    .append('g')
    .attr('id', 'dataVizContainer')
    ;

  var dataVizContainer = d3.select('#dataVizContainer');

  // Axis Container
  svg
    .append('g')
    .attr('id', "axisContainer")
    ;

    var axisContainer = d3.select('#axisContainer');

// Visualization of data
  // X & Y Axis
  axisContainer
    .append('g')
    .attr('class', 'axis')
    .attr('id', 'xAxis')
    .attr('transform', 'translate('+ 0 + ','+ (height - margin.bottom) + ')')
    .call(xAxis)
    ;

  var xAxisChart = d3.select('#xAxis')

  axisContainer
    .append('g')
    .attr('class', 'axis')
    .attr('id', 'yAxis')
    .attr('transform', 'translate('+ margin.left + ','+ 0 + ')')
    .call(yAxis)
    ;

  var yAxisChart = d3.select('#yAxis')

  // Bars
  dataVizContainer
    .append('g')
    .attr('id', 'bars')
    ;

  var bars = d3.select('#bars')
// Interaction with Data

  // Interaction selecting year
  function updateYear(selectedYear){
    // Filter & Transform Data to requirements
    var updateData = d3.filter(data, (item) => item.year == selectedYear);
    updateData.sort((a,b) => b.population - a.population);
    var dataSlice = updateData.slice(0,10)

    // Axis
    xScale
      .domain(d3.map(dataSlice, (item) => item.region))
      ;


    yScale
      .domain([0,d3.max(dataSlice, (item) => item.population)])
      .nice()
      ;

    yAxis
      .scale(yScale)
      .tickFormat(lineValueFormat)
      ;

    bars
      .selectAll('rect')
      .data(dataSlice)
      .join('rect')
      .classed('bar',true)
      .attr('x', (d) => xScale(d.region))
      .attr('y', (d) => yScale(d.population))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => (height - margin.bottom) - yScale(d.population))
      .attr('y', (d) => yScale(d.population))
      .attr("fill", (d,i) => colorScale[i])
      .attr('class', (d) => d.region)
      .on('mouseenter', onMouseEnter)
      .on("mouseout", onMouseOut)
      .on("mousemove", onMouseMove)
      ;

    yAxisChart
      .transition()
      .duration(1000)
      .call(yAxis)
      ;

    xAxisChart
      .transition()
      .duration(1000)
      .call(xAxis)
      ;

  }
    // Initiation selecting year interaction
  yearsDropdown
    .on('change', function(d){
      var selectedOption = d3.select(this).property('value');
      updateYear(selectedOption);
  })

  // interaction tooltip bars
  function onMouseEnter(d,i){
    tooltip
      .transition()
      .duration(200)
      .style('opacity', 0.9);
  }
  function onMouseOut(d,i){
      tooltip
        .transition()
        .duration(500)
        .style('opacity', 0);
  }
  function onMouseMove(d,i){
    tooltip
      .text(i.population) 
      .attr("transform", "translate("+ d.screenY + "," + d.screenX + ")")
      .style("top", (d.screenY)+"px").style("left",(d.screenX)+"px")        
  }

// ACTIVATE PRESET Data
updateYear("2020")

d3.select(".year2020")
  .attr('selected', 'selected')
}


//DATA LOADING
d3.csv("PerCountryPopulation19502050.csv").then(function(data){

//DATA PREPARATION
// Most Data preparations have already been done in Data Cleaning & Preparation.js
  data.forEach((item, i) => {
    item.countryCode = +item.countryCode;
    item.year = +item.year;
    item.population = +item.population;
  });

  // Filtering Data
  data = d3.filter(data, (item) => item.countryCode < 900 && item.countryCode > 0) // Country codes 0 and above 900 represent continents, regions, etc not countries

  // Start visualisation
  render(data)
  
})

//RUNNING TIME
var endTime = performance.now();
console.log(`Call to doSomething took ${endTime - startTime} milliseconds`);
