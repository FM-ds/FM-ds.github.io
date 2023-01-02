let box_svg = d3.select("#boxplotContainer").append("svg")
    .attr("viewBox", "-25 -5 320 210") 
    .attr("id", "boxplotSvg");

//Options
let width = 300;
let height = 200;
let ax_font_size = "5px";
let ax_weight = "0.25px";

//our x axis scale - not the axis itself
let x_scale = d3.scalePoint()
    .domain(['United Kingdom', 'France', 'Germany', 'Netherlands', 'Denmark'])
    .range([0, width])
    .padding(0.4)
    .align(0.5);

let firstStageScale = d3.scaleLog()
    .domain([ 7200*0.9, 454347 ]) //Hardcoding this, sorry
    .range(
        [height,0]
    ); 

let secondStageScale = d3.scaleLog()
    .domain([ 0.3,1,17 ]) //Hardcoding this, sorry
    .range(
        [200,100,0]
    );

let sizeScale = d3.scaleLinear()
    .domain([22025, 3644826])
    .range([1,13]) //TODO link to area not radius

let countryScale = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(['United Kingdom', 'France', 'Germany', 'Netherlands', 'Denmark']);

let plotData = 'boxplotdata.json'

let foo = null

box_data = null

let plotArea, y, points_group, points_gs, points;

// let median_Sections = ["DK013", "DE269", "ES416", "FRB01", "ITH56", "NL337", "PL618", "UKJ35"]
let median_section_names = ["DK013", "DE269", "FRB01", "NL337", "UKJ35"]

d3.json(plotData, function (data) {
    box_data = data;
    //Defining the Plot Area
    plotArea = box_svg.append("g")
        .attr("id", "plotArea")
        .style("fill", "#bbdee2");
    let plotBack = plotArea.append("rect")
        .attr("width", 300)
        .attr("height", 200)
        .style("fill", "#ffffff")

    foo = x_scale;

    y_scale = firstStageScale;

    //drawing the points
    points_gs = plotArea
        .append("g")
        .attr("id", "points")
            .selectAll('point')
            .data(data)
            .enter()
            .append("g")
                .attr("class", function(d){
                    if(d.Country == 'United Kingdom'){return "firstStage scatterPoint"}
                    return "secondStage scatterPoint"
                })
                .attr("GEO", d => d.GEO)
                .attr("transform", d => `translate(${x_scale(d.Country) -15 + Math.random()*30}, ${y_scale(d['2019'])})`)

    points = points_gs
        .append("circle")
            //.attr("cx", d => x(d.Country) -15 + Math.random()*30)
            //.attr("cy", d => y(d['2019']))
            .attr("r", 2)
            .style("fill", d => countryScale(d.Country))
            .style("opacity", 0.7);

    
    //Scale the plot area
    //plotArea.style("transform", "scale(0.8)")


    // First Stage
    // Make only the UK's Label visible
    drawAxes()

    d3.select('#box_x_ax').selectAll('.tick')
        .style('opacity', function(d,i){if(i!=0){
                return(0)
            }
            return(1)
        });

});

function drawAxes(){
    //Appending the x axis 
    let x_ax = d3.axisBottom(x_scale)
        .tickSize(0)
        .tickSizeOuter(0);


    plotArea.append("g")
        .attr("transform", "translate(0," + (height-8) + ")")
        .attr("id", "box_x_ax")
        .style("font-size", ax_font_size)
        .call(x_ax);

    // ... and the y axis
    let y_ax = d3.axisLeft(y_scale)
        .tickSizeOuter(0)
        .tickValues([8000, 20000, 100000, 200000])
        .tickFormat("r")
        .tickSize(0)
        .tickFormat(d3.format(",.0f"));

    plotArea.append("g")
        .attr("id", "box_y_ax")
        .style("font-size", ax_font_size)
        .style("stroke-width", ax_weight)
        .call(y_ax);

    // ... and the y axis title
    y_axis_label_group = box_svg
        .append("g")
        .attr("id", "y_axis_label_group")
        .attr("transform", `translate(-125 ${height/2})`);
    
    y_axis_label_group.append("text")
        .attr("id", "y_axis_scale")
        .attr("class", "y_axis_label")
        .style("font-size", ax_font_size)
        .text("Regional GVA Per Capita, 2019 €")
        .attr("y", height/2)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)");

}

function updateSize(attr='pop_2019', r=null){
    console.log(r)
    console.log(r>0);
    let size = d => sizeScale(d['pop_2019']);
    if(r){
        console.log('foo');
        size = r;
    }
    points
        .transition()
        .duration(600)
        .attr("r", size);
}

function updatePosition(attr="2019_rel", scale=secondStageScale){
    points_gs
        .transition()
        .duration(1200)
        .attr("transform", function(d){
            current_transform_first = d3.select(this).attr('transform').split(",")[0];
            return(`${current_transform_first}, ${scale(d[attr])})`)
        })
    let y_ax = d3.axisLeft(scale)
        .tickSizeOuter(0)
        .ticks(6)
        //.tickValues([0.3, 0.7, 1, 10])
        .tickSize(0)
        .tickFormat(d3.format(","));
    d3.select('#box_y_ax')
        .transition()
        .duration(1200)
        .call(y_ax);
}

function medians_focus(){
    // Add borders to median regions and labels
    let median_sections = d3.selectAll("g")
        .filter(function() {
            return median_section_names.includes(d3.select(this).attr("GEO")); // filter by single attribute
        })
    median_sections.attr("class", median_sections.attr("class") + " median_region")

    median_sections
        .attr('stroke', 'rgba(26, 26, 26, 0.8)')
        .attr('stroke-width', 2)
}
