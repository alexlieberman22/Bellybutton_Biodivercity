function init(){
    var selector = d3.select('#selDataset');

    d3.json('samples.json').then(data => {
        console.log(data);

        var sampleNames = data.names;

        sampleNames.forEach(sample => {
            selector.append("option").text(sample).property("value", sample);
        });
    });

};

function optionChanged(newSample) {
    buildMetadata(newSample);
    // buildCharts(newSample);
}

function buildMetadata(sample) {
    d3.json('samples.json').then((data) =>{
        var metaData = data.metadata;
        var resultArray = metaData.filter(item => item.id == sample);
        var result = resultArray[0];

        var panel = d3.select("#sample-metadata");
        panel.html("");

        panel.append("h6").text("ID: "+ result.id);
        panel.append("h6").text("ETHNICITY: "+ result.ethnicity);
        panel.append("h6").text("GENDER: "+ result.gender);
        panel.append("h6").text("AGE: "+ result.age);
        panel.append("h6").text("LOCATION: "+ result.location);
        panel.append("h6").text("BBTYPE: "+ result.bbtype);
        panel.append("h6").text("WFREQ: "+ result.wfreq);
        });

};










init();