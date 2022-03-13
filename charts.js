function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  
  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);

    var sampleNames = data.names;

    sampleNames.forEach(sample => {
      selector.append("option").text(sample).property("value", sample);
      });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Delete old trace for bar chart
  Plotly.deleteTraces('bar', 0)
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(item => item.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = data.samples.filter(item => item.id == sample);
    var metaArray = data.metadata.filter(item => item.id == sample);

    // 5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    var metaResult = metaArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuID = result.otu_ids;
    var otuLabel = result.otu_labels;
    var sampleValues = result.sample_values;
    var wFreq = metaResult.wfreq;


    //Bar Chart
    
    // 7. Create yticks/ xticks for the bar chart.
    var xticks = sampleValues.slice(0,10).reverse();
    var yticks = otuID.slice(0,10).map(ID => `OTU ${ID}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: xticks,
      y: yticks,
      hovertext: otuLabel,
      orientation: 'h',
      type: 'bar'
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.plot('bar', barData, barLayout);


    // Bubble Chart

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuID,
      y: sampleValues,
      hovertext: otuLabel,
      orientation: 'h',
      mode: 'markers',
      marker: {size: sampleValues,
        color: otuID,
        colorscale: 'Jet'},
      type: 'bubble'
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      margin: {t:30},
      hovermode: 'closest'
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 


    // Gauge

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wFreq,
      title: {text: "Belly Button Washing Frequency"},
      mode: 'gauge+number',
      gauge: {
        axis: {range: [null, 10]},
        bar: {color: "blue"},
        steps: [
          {range: [0, 2], color: "#B64F00" },
          {range: [2, 4], color: "orange" },
          {range: [4, 6], color: "yellow" },
          {range: [6, 8], color: "green" },
          {range: [8, 10], color: "darkgreen" },
        ]
      },
      type: 'indicator'
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  });
} 
