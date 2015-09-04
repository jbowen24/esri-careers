

Esri Careers Page
=======



1. [View Starter App - ArcGIS](https://ArcGIS.github.io/gis-day/index.html)

2. [View Starter App - Esri-Leaflet](http://ArcGIS.github.io/gis-day/esri-leaflet.html)

## Contributing

Anyone can contribute to this project. Depending on your time and expertise you can contribute in a few ways:

- Write code to add or improve a feature. For example add an address locator, geolocation near me, or on-hover information windows
- Design and User Experience to make the map compelling on desktop and mobile devices
- Identify issues with functionality, locations on the map, or participant information.

## How to Contribute

You can start by [creating an issue](https://github.com/ArcGIS/gis-day/issues). Please provide detailed information on your idea or the bug and include a screenshot, wireframe or even whiteboard or paper sketch.

If you want to modify the code or HTML/CSS, you should submit a "Pull Request" (or _PR_). This will be reviewed and commented and improved and once approved we will merge it into the live version. Pull Requests are best when they are small, succinct changes and only need to take a few minutes. By small iterative changes we can progressively build a better map. For example, if you want to propose a new marker icon, submit a Pull Request with just that change. 

To submit a Pull Request, first you should [click the "Fork"](https://github.com/ArcGIS/gis-day/fork) button to make your own copy. You can then clone the repository (copy) to your computer and modify. You then push it to your copy on GitHub and finally submit a "Pull Request". 

It is easiest to submit a pull-request from your `gh-pages` branch so that we can verify the functionality by visiting `http://username.github.io/gis-day`. 

Also, if you are responding to an existing issue, please include "Resolves #issue" where `#issue` is the issue number. This will cross-link to the issue as well as close the issue when your Pull Request is accepted.  

For more details, see [Esri Contributing Guidelines](https://github.com/esri/contributing) or [GitHub's notes on Forking](https://help.github.com/articles/fork-a-repo) to see this in detail.

## Team

This project is currently supported by a team that is across Esri. 

## Licensing

Copyright 2014 Esri

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

A copy of the license is available in the repository's license.txt file.
=======
# gis-
=======
Esri Careers Page
=======

GIS Day provides an international forum for users of GIS technology to demonstrate real-world applications that are making a difference in our society. This year it is November 19, 2014. 

This repository is the map of participants and events. It is an open & collaborative project that we encourage you to share your ideas, code and design to make the experience the best possible to encourage your local communities to join a local event and learn about GIS.

![gis_day_events_around_the_world___gis_day_-_november_14__2012](https://cloud.githubusercontent.com/assets/1218/3986323/121da8c0-289a-11e4-9e65-e8c49113da88.png)
_oh dear..._

1. [View Starter App - ArcGIS](https://ArcGIS.github.io/gis-day/index.html)

2. [View Starter App - Esri-Leaflet](http://ArcGIS.github.io/gis-day/esri-leaflet.html)

## Contributing

Anyone can contribute to this project. Depending on your time and expertise you can contribute in a few ways:

- Write code to add or improve a feature. For example add an address locator, geolocation near me, or on-hover information windows
- Design and User Experience to make the map compelling on desktop and mobile devices
- Identify issues with functionality, locations on the map, or participant information.

## How to Contribute

You can start by [creating an issue](https://github.com/ArcGIS/gis-day/issues). Please provide detailed information on your idea or the bug and include a screenshot, wireframe or even whiteboard or paper sketch.

If you want to modify the code or HTML/CSS, you should submit a "Pull Request" (or _PR_). This will be reviewed and commented and improved and once approved we will merge it into the live version. Pull Requests are best when they are small, succinct changes and only need to take a few minutes. By small iterative changes we can progressively build a better map. For example, if you want to propose a new marker icon, submit a Pull Request with just that change. 

To submit a Pull Request, first you should [click the "Fork"](https://github.com/ArcGIS/gis-day/fork) button to make your own copy. You can then clone the repository (copy) to your computer and modify. You then push it to your copy on GitHub and finally submit a "Pull Request". 

It is easiest to submit a pull-request from your `gh-pages` branch so that we can verify the functionality by visiting `http://username.github.io/gis-day`. 

Also, if you are responding to an existing issue, please include "Resolves #issue" where `#issue` is the issue number. This will cross-link to the issue as well as close the issue when your Pull Request is accepted.  

For more details, see [Esri Contributing Guidelines](https://github.com/esri/contributing) or [GitHub's notes on Forking](https://help.github.com/articles/fork-a-repo) to see this in detail.

## Team

This project is currently supported by a team that is across Esri. 

## Licensing

Copyright 2014 Esri

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

A copy of the license is available in the repository's license.txt file.
=======
# gis-day-map

A simple map built with [esri-leaflet](https://github.com/Esri/esri-leaflet) to find [GIS Day](http://gisday.com/gis-day-events-map.html) events all around the world. Share it with your friends or just use the code to build your own fun and interactive mapping apps. The entire app is only about 150 lines of JavaScirpt code!

[View it live](http://esri.github.com/gis-day-map/index.html)

![App](https://raw.github.com/Esri/gis-day-map/master/gis-day-map.png)

## Features
* [esri-leaflet](https://github.com/Esri/esri-leaflet), [esri-leaflet-geocoder](https://github.com/Esri/esri-leaflet-geocoder), [ArcGIS basemaps](http://www.arcgis.com/features/maps/index.html) and [ArcGIS Online feature services](https://developers.arcgis.com/en/features/cloud-storage/)
* Dynamic search for feature service and world geocode service
* Interactive popups
* Point clustering

## Instructions

1. Fork and then clone the repo. 
2. Try the example live [here](http://esri.github.com/gis-day-map/index.html).

NOTE: You should just be able to cut-and-paste and run it in JSFiddle!

## Code
```html
<div id="map"></div>

<script>
    var map,
        clusterLayer,
        singlePin;

    map = L.map('map', { maxZoom: 16 }).setView([15, -35], 2);

    // Use Esri Streets or GrayLables
    L.esri.basemapLayer('Streets').addTo(map);

    singlePin = L.divIcon({
        html: '<div><svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"/></svg></div>',
        className: 'marker',
        iconSize: null,
        popupAnchor: [0, -11]
    });

    // Create cluster layer from GIS Day data in AGOL
    clusterLayer = L.esri.clusteredFeatureLayer('http://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/gisdaydata/FeatureServer/0', 
    {
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        maxClusterRadius: 55,

        // Single pins
        pointToLayer: function (geojson, latlng) {
            return L.marker(latlng, {
                icon: singlePin
            });
        },

        // Format popups
        onEachFeature: function (geojson, marker) {
            var url = geojson.properties.URL ? "<a target='_blank' href='" + geojson.properties.URL.toString() + "'>" + geojson.properties.Name + "</a>" : geojson.properties.Name,
                desc =  geojson.properties.Description,
                dateTime = new Date(geojson.properties.DateTime),
                min = dateTime.getMinutes() ? dateTime.getMinutes() : "00",
                hr = dateTime.getUTCHours(),
                ampm = hr < 12 ? "AM" : "PM";
            hr = hr > 12 ? hr - 12 : hr;
            dateTime = dateTime.toDateString() + ", " + hr + ":" + min + " " + ampm;
            marker.bindPopup("<h2>" + url + "</h2><p>" +  desc + "<br>" + geojson.properties.Type + " " + geojson.properties.Audience + "</p></div><div class='popup-bottom'><p>DATE: " + dateTime + "</p><p>ADDRESS: " + geojson.properties.Address + "</p><div class='popup-host'><p>HOST: <a target='_top' href='mailto:" + geojson.properties.Email + "?subject=GIS Day Event'>" + geojson.properties.Organization + "</a></p></div></div>");
            // store data
            marker.properties = {};
            marker.properties.Name = geojson.properties.Name;
        },

        // Cluster styles
        iconCreateFunction: function (cluster) {
            var count = cluster.getChildCount(),
                clusterSize;
            // Get cluster count
            if (count > 1 && count <= 5)
                clusterSize = "small";
            else if (count > 5 && count <= 20)
                clusterSize = "medium";
            else if (count > 20 && count <= 50)
                clusterSize = "large";
            else
                clusterSize = "xlarge";
            // Create cluster
            return new L.DivIcon({
                html: "<div><span>"+count+"</span></div>",
                className:"cluster cluster-"+clusterSize,
                iconSize: null
            });
        }
    }).addTo(map);

    // Auto-show popup
    clusterLayer.on('mouseover', function (e) {
        e.layer.openPopup();
    });

    // Zoom in to single feature, always show popup
    clusterLayer.on('click', function (e) {
        e.layer.openPopup();
    });

    // Show popup
    clusterLayer.on('mousedown', function (e) {
        e.layer.openPopup();     
    }); 

    // Zoom
    clusterLayer.on('dblclick', function(e) {
        map.setZoomAround(e.latlng, map.getZoom() + 1);
    });

    // Prevent toggling/flickering effect of popup
    map.on('mouseup', function(e) {
        if (e.target._popup) {
            e.target._popup._isOpen = false;
        }
    });

    // Add geolocation control
    L.control.locate({
      follow: false,
      icon: 'icon-location',
      showPopup: false,
       locateOptions: {
         maxZoom: 13
      }
    }).addTo(map);

    // Add search control to search world places as well as GIS Day feature service
    var searchControl = new L.esri.Geocoding.Controls.Geosearch({
      placeholder: "Search for event name, host or location",
      useMapBounds: false,
      providers: [
            new L.esri.Geocoding.Controls.Geosearch.Providers.FeatureLayer('http://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/gisdaydata/FeatureServer/0', {
          searchFields: ['Name', 'Organization'],
          label: 'GIS Day Events',
          bufferRadius: 5000,
          formatSuggestion: function(feature){
            return feature.properties.Name + ' - ' + feature.properties.Organization;
          }
        })
      ]
    }).addTo(map);

    // Show feature and popup when selected 
    searchControl.on("results", function(data){
       if(data.results && data.results[0].properties.FID){
        clusterLayer.once('load', function(){
          clusterLayer.getFeature(data.results[0].properties.FID).openPopup();
        });
      }
    });
</script>
```

## Requirements

* Notepad or your favorite HTML editor

## Resources

* [ArcGIS for JavaScript API Resource Center](http://developers.arcgis.com)
* [ArcGIS Blog](http://blogs.esri.com/esri/arcgis/)
* [twitter@esri](http://twitter.com/esrigeodev)

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.  Thank you!

## Contributing

Anyone and everyone is welcome to contribute. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing
Copyright 2014 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt]( https://raw.github.com/Esri/gis-day-map/master/license.txt) file.

[](Esri Tags: Web Mapping ArcGIS Leaflet esri-leaflet Cluster Basemaps)
[](Esri Language: JavaScript)
