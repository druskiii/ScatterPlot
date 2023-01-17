let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
let req = new XMLHttpRequest();

let values = [];
let xScale, yScale;

let width = 800;
let height = 600;
let padding = 60;

let svg = d3.select('svg');
let tooltip = d3.select('#tooltip')

let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

let generateScales = () => {
    xScale = d3.scaleLinear()
            .range([padding, width-padding])
            .domain([d3.min(values, (item) => {
                return item['Year']
            }) - 1, d3.max(values, (item) => {
                return item['Year']
            }) + 1])
            
    // Height-padding is basically the opposite, so its going the direction you want it to!        
    yScale = d3.scaleTime()
            .range([padding, height-padding])
            .domain([d3.min(values, (item) => {
                return new Date(item['Seconds'] * 1000)
            }), d3.max(values, (item) => {
                return new Date(item['Seconds'] * 1000)
            })])
}

let drawPoints = () => {
    
    svg.selectAll('circle')
        .data(values)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', 5)
        .attr('data-xvalue', (item) => {
            return item['Year']
        })
        .attr('data-yvalue', (item) => {
            return new Date(item['Seconds'] * 1000)
        })
        .attr('cx', (item) => {
            return xScale(item['Year'])
        })
        .attr('cy', (item) => {
            return yScale(new Date(item['Seconds'] * 1000))
        })
        .attr('fill', (item) => {
            if(item['Doping'] != ''){
                return 'orange'
            } else {
                return 'lightgreen'
            }
        })
        .on('mouseover', (item) => {
            tooltip.transition()
                   .style('visibility', 'visible')

            if(item['Doping'] != ""){
                tooltip.text(item['Year'] + ' - ' + 
                    item['Name'] + ' - ' + item['Time'] + ' - ' + item['Doping'])
            } else {
                tooltip.text(item['Year'] + ' - ' + 
                    item['Name'] + ' - ' + item['Time'] + ' - ' + 'No Allegations')
            }
            tooltip.attr('data-year', item['Year'])
        })
        .on('mouseout', (item) => {
            tooltip.transition()
                   .style('visibility', 'hidden')
        })
        

}

let generateAxis = () => {
    let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('d')) // Sets format of year to an integer!!
        svg.append('g')
            .call(xAxis)
            .attr('id', 'x-axis')
            .attr('transform', 'translate(0, ' + (height-padding) + ')')

    let yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat('%M:%S')) // This is the minutes seconds format for d3!
        svg.append('g')
            .call(yAxis)
            .attr('id', 'y-axis')
            .attr('transform', 'translate(' + padding + ', 0)')
}

req.open('GET', url, true)
req.onload = () => {
    values = JSON.parse(req.responseText)
    console.log(values);
    drawCanvas();
    generateScales();
    drawPoints();
    generateAxis();
}

req.send();