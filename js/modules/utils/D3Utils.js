export function createArc(startAngle, endAngle, innerRadius, outerRadius) {
	var arc = d3.svg.arc()
        .startAngle(startAngle)
        .endAngle(endAngle)
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        
        return arc
}