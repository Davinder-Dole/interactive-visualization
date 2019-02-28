function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
var url1 = `/metadata/${sample}`;
d3.json(url1).then(function(sample) {
console.log(sample);
    
  // Use d3 to select the panel with id of `#sample-metadata`
panel=d3.select("#sample-metadata");
  // Use `.html("") to clear any existing metadata
panel.html("");
  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
Object.entries(sample).forEach(([key,value])=>{
var row = panel.append("p");
row.text(`${key} - ${value}`);
});
});
}

function buildGauge(sample){
 // BONUS: Build the Gauge Chart
 var url1 = `/metadata/${sample}`;
d3.json(url1).then(function(sample) {
 // Enter a speed
var level = sample.WFREQ;

// Trig to calc meter point
var degrees = 9 - level,
     radius = .5;
var radians = degrees * Math.PI / 9;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'speed',
    text: level,
    hoverinfo: 'text+name'},
  { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9,50/9,50/9,50],
  rotation: 90,
  text:['9-8', '8-7', '7-6', '6-5', '5-4', '4-3', '3-2', '2-1', '1-0',''],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                         'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                         'rgba(210, 206, 145, .5)', 'rgba(215,210,160,.5)',
                         'rgba(220,216,190,.5)','rgba(232, 226, 202, .5)',
                         'rgba(245,240,230,.5)','rgba(255, 255, 255, 0)']},
  labels: ['9-8', '8-7', '7-6', '6-5', '5-4', '4-3', '3-2', '2-1', '1-0',''],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: 'Belly Button Washing Frequency Scrubs per week',
  height: 500,
  width: 500,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', data, layout,{showSendToCloud:true});
  });
}


  

   

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url2 = `/samples/${sample}`;
  d3.json(url2).then(function(sample){
console.log(sample);
 // @TODO: Build a Bubble Chart using the sample data
 var x_value=sample.otu_ids;
 var y_value =sample.sample_values;
 var text=sample.otu_labels;
 var marker_color=sample.otu_ids;
 var marker_size =sample.sample_values;
 
  

var trace1 = {
  x: x_value,
  y: y_value,
  mode: 'markers',
  type:'scatter',
  text: text,
  marker: { size: marker_size,
            color:marker_color }
  };
data=[trace1];
Plotly.newPlot('bubble', data);


// @TODO: Build a Pie Chart // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pie_values = sample.sample_values.slice(0,10);
    var pie_labels = sample.otu_ids.slice(0,10);
    var pie_hover = sample.otu_labels.slice(0,10);
    var data = [{
      values: pie_values,
      labels: pie_labels,
      hovertext: pie_hover,
      type: 'pie'
    }];
    Plotly.newPlot('pie', data);
  });
   

    
  
   
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildGauge(firstSample);    
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(newSample);
}

// Initialize the dashboard
init();
