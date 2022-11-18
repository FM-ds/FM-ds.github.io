svg = d3.select('#audioChart')
    .append('svg')
    .attr("viewBox", "0 0 300 200");

// Append the Audio
audio = d3.select('#audioChart')
    .append("audio")
    .attr("src", "week8/trade.mp3");

//CN Data
CN_d = [
    {size: 0.283333333,
        t: 0.022369021},
    {size: 0.3,
        t: 7.381776765},
    {size: 0.1875,
        t: 9.014715262},
    {size: 0.133333333,
        t: 9.238405467},
    {size: 0.2,
        t: 9.82}
];

//US Data
US_d = [
    {size: 0.283333333,
        t: 0},
    {size: 0.133333333,
        t: 1},
    {size: 1,
        t: 6.889658314},
    {size: 0.666666667,
        t: 9.797630979},
];

let months = ["August 2018", "September 2018", "October 2018", "November 2018", "December 2018", "January 2019", "February 2019", "March 2019", "April 2019", "May 2019", "June 2019", "July 2019", "August 2019", "September 2019"];
let m_off = [0.581594533, 1.275034169, 1.946104784, 2.639544419, 3.310615034, 4.00405467, 4.697494305, 5.323826879, 6.017266515, 6.68833713, 7.381776765, 8.05284738, 8.746287016, 8.768656036];

//Append the Border Rect
svg.append("rect")
    .attr("x", "0.25")
    .attr("y", "0.25")
    .attr("width", "299")
    .attr("height", "199")
    .attr("rx", "10")
    .style("stroke", "#2a2a2a")
    .style("stroke-width", "0.5")
    .style("fill", "#ffffff");


//Append the two Indicator Circles
c_circles = []
c_texts = []

attrs = [
    {
        "c": {"cx":100, "cy":90},
        "t": {"text": "US"}
    },
    {
        "c": {"cx":200, "cy":90},
        "t": {"text": "China"}
    }
]

for(let i=0; i<2; i++){
    c_circles.push(
        svg.append("circle")
            .attr("r", 5)
            .attr("cx", attrs[i].c.cx)
            .attr("cy", attrs[i].c.cy)
            .style("fill", "#d8d8d8")
    );
    c_texts.push(
        svg.append("text")
            .text(attrs[i].t.text)
            .attr("text-anchor", "middle")
            .attr("font-size", 8)
            .attr("font-family", "arial")
            .attr("x", attrs[i].c.cx )
            .attr("y", attrs[i].c.cy+55)
    );
}

[US_c, CN_c] = c_circles

// Append the Play Button
play_btn = svg.append("g")
    .attr("transform", "translate(150 180)")
    .style('cursor', "pointer")
    .on("click", function(d){
        audio.node().play()

        US_d.forEach(d => {
            US_c
                .transition()
                .delay(d.t*1000)
                .duration(100)
                .attr("r", 5+35*d.size)
                .style("fill", `rgb(${216-186*d.size}, ${216-186*d.size}, 216)`) //rgb(30, 30, 216)
            US_c
                .transition()
                .delay((d.t)*1000+300)
                .duration(100)
                .attr("r", 5)
                .style("fill", "rgb(216, 216, 216)")
        });

        CN_d.forEach(d => {
            CN_c
                .transition()
                .delay(d.t*1000)
                .duration(100)
                .attr("r", 5+35*d.size)
                .style("fill", `rgb(${216-186*d.size}, ${216-186*d.size}, 216)`) //rgb(30, 30, 216)
            CN_c
                .transition()
                .delay((d.t)*1000+300)
                .duration(100)
                .attr("r", 5)
                .style("fill", "rgb(216, 216, 216)")
        });

        for(let i = 0; i<months.length; i++){
            sbtlt
                .transition()
                .delay(m_off[i]*1000)
                .duration(0)
                .text(months[i]);
        }

    });


play_btn.append("rect")
    .attr("width", "40")
    .attr("height", "14")
    .attr("rx", "2")
    .attr("transform", "translate( -20 -10 )")
    .style("stroke", "#2a2a2a")
    .style("stroke-width", "0.2")
    .style("fill", "#ffffff")


play_btn.append("text")
    .text("⏵ Play")
    .attr("text-anchor", "middle")
    .attr("font-size", 8)
    .attr("font-family", "arial");

// Append the Title
svg.append('text')
    .text('The US-China Trade War')
    .attr("x", 150)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .style("font-size", 14)
    .style("font-family", "arial")
    .style("font-weight", "bold");

// And the Subtitle

sbtlt = svg.append('text')
    .text('April 20xx')
    .attr("x", 150)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .style("font-size", 8)
    .style("font-family", "arial")
    .style("font-weight", "light");
