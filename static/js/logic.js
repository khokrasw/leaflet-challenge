// Intervals and Colors
// Red #ff0000 rgb(255,0,0)   Green #00ff00 rgb(0,255,0)    Blue #0000ff  rgb(0,0,255)
// var uIntervals=[5,          4,     3,       2,          1,          0      ]
var uIntervals=[0,          1,     2,       3,          4,          5      ]
var uColors=   ["darkred", "red", "coral", "hotpink", "lightpink", "yellow"]

// USGS link for Earthquake Data
var Base_USGS_URL="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/"
var Time_Frame="all_day.geojson";
Full_URL=Base_USGS_URL+Time_Frame;
d3.json(Full_URL, function(data) 
{
    console.log(data); // What is 3rd coordinate??? Depth/Height
    ParseFeatures(data.features);
});

function ParseFeatures(FeatureData) 
{

    var EQ_Info = L.geoJSON(FeatureData, {
        onEachFeature: function(feature, layer) 
        {
            layer.bindPopup("<h3>Magnitude: " + feature.properties.mag             + "</h3>" +
                            "<h3>Location: "  + feature.properties.place           + "</h3>" +
                            "<h3>Long/Lat/Depth: " + feature.geometry.coordinates  + "</h3>" +
                            "</h3><hr><p>"    + new Date(feature.properties.time)  + "</p>");
        },
        pointToLayer: function(feature, latlng) 
        {
            return new L.circle(latlng, {
                radius: setRadius(feature.properties.mag),
                fillColor: AssignColors(feature.properties.mag),
                fillOpacity: 0.7,
                color: "black",
                stroke: true,
                weight: 0.20
            })
        }
    });
    Map_Creation(EQ_Info);
}


//Compute circles radii
function setRadius(mag) 
{
    return mag * 40000
}

//Assign Colors based on intensity
function AssignColors(mag) 
{
    xLen=uIntervals.length;
    for (let i = 0; i < xLen; i++) 
    {
      if (mag > uIntervals[xLen-i]) {return uColors[i]}
    }
    return "gainsboro";
}
  

//key is pk.eyJ1Ijoia2hva3Jhc3ciLCJhIjoiY2sycnJtamJtMGNscTNjcHIwNDZuZHhqNCJ9.vOT5HDa8cKbIdInGwIkvrg
function Map_Creation(over_lay) 
{
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1Ijoia2hva3Jhc3ciLCJhIjoiY2sycnJtamJtMGNscTNjcHIwNDZuZHhqNCJ9.vOT5HDa8cKbIdInGwIkvrg");

    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1Ijoia2hva3Jhc3ciLCJhIjoiY2sycnJtamJtMGNscTNjcHIwNDZuZHhqNCJ9.vOT5HDa8cKbIdInGwIkvrg");

    var greymap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1Ijoia2hva3Jhc3ciLCJhIjoiY2sycnJtamJtMGNscTNjcHIwNDZuZHhqNCJ9.vOT5HDa8cKbIdInGwIkvrg");

    // Base Map options 
    var baseMaps = {"Satellite": satellite,"Grey Map": greymap,"Out Doors": outdoors};

    // Over Lay Options
    var overlayMaps = {"Earthquakes": over_lay};

    // Create our map, giving it the outdoors, earthquakes and tectonic plates layers to display on load
    var myMap = L.map("map", 
        {
         center: [46.3585, -128.2828],       // North West main land -122.282833333333,46.3585
         zoom: 4,
         layers: [outdoors, over_lay]
        });


    // Adding layer controls to the map
    L.control.layers(baseMaps, overlayMaps, {collapsed: true}).addTo(myMap);

    // Place a legend
    var legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function(myMap) 
    {
        var div = L.DomUtil.create('div', 'info legend'),
                grades=uIntervals, labels=[];
           
        for (var i = 0; i < uIntervals.length; i++) 
        {
            div.innerHTML +=
                '<i style="background:' + AssignColors(uIntervals[i] + 1) + '"></i> ' +
                uIntervals[i] + (uIntervals[i + 1] ? '&ndash;' + uIntervals[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
}

