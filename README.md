# gis-day-map

A simple map you can use to search for GIS Day events around the world. Share it with your friends or just use the code to learn how to build your own fun and interactive mapping apps. The entire app is only about 150 lines of JavaScirpt code!

[View it live](http://esri.github.com/gis-day-map/index.html)

![App](https://raw.github.com/Esri/gis-day-map/master/gis-day-map.png)

## Features
* esri-leaflet, esri-leaflet-geocoder, basemaps and ArcGIS Online feature services
* Dynamic search for feature service and world geocode service
* Interactive popups
* Point clustering

## Instructions

1. Fork and then clone the repo. 
2. Try the example live [here](http://esri.github.com/gis-day-map/index.html).

NOTE: You should just be able to cut-and-paste and run it in JSFiddle!

## Code
```html
<html>
<head>
    <meta charset=utf-8 />
    <title>GIS Day Esri-Leaflet</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />

    <!-- Load Leaflet from CDN-->
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
    <script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>

    <!-- Load Esri Leaflet from CDN -->
    <script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet/1.0.0-rc.4/esri-leaflet.js"></script>
    
    <!-- Load Esri Clustered Feature Layer from CDN -->
    <script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet-clustered-feature-layer/1.0.0-rc.4/esri-leaflet-clustered-feature-layer.js"></script>

    <!-- Include Leaflet.markercluster via rawgit.com, do not use in production -->
    <link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/Leaflet/Leaflet.markercluster/v0.4.0/dist/MarkerCluster.Default.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/Leaflet/Leaflet.markercluster/v0.4.0/dist/MarkerCluster.css">
    <script src="https://cdn.rawgit.com/Leaflet/Leaflet.markercluster/v0.4.0/dist/leaflet.markercluster.js"></script>

    <!-- Fonts -->
    <script type="text/javascript" src="http://fast.fonts.net/jsapi/4a60d16b-c9e4-404d-89d3-809adb97d65c.js"></script>

    <!-- Esri Leaflet Geocoder -->
    <script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet-geocoder/1.0.0-rc.2/esri-leaflet-geocoder.js"></script>
    <link rel="stylesheet" type="text/css" href="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet-geocoder/1.0.0-rc.2/esri-leaflet-geocoder.css">
  
    <!-- More controls -->
    <script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-locatecontrol/v0.24.0/L.Control.Locate.js'></script>
    <link href='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-locatecontrol/v0.24.0/L.Control.Locate.css' rel='stylesheet' />
    
    <!--[if lt IE 9]>
      <link href='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-locatecontrol/v0.21.0/L.Control.Locate.ie.css' rel='stylesheet' />
    <![endif]-->

    <style>
        body {margin:0;padding:0;}
        #map {position: absolute;top:0;bottom:0;right:0;left:0;}

        /* Clusters */
        .cluster {
            color: #fff;
            font-size: 14px;
            font-weight: 700;
        }
        /* Small */
        .cluster-small {
            box-shadow: 0 0 4px rgba(255,255,255,0.15);
            background-color: rgba(140,177,210,0.4);
            margin-left: -20px;
            margin-top: -20px;
            width: 40px;
            height: 40px;
            border-radius: 20px;
        }
        .cluster-small:hover {
          background-color: rgba(140,177,210,0.7);
        }
        .cluster-small:hover > div {
          background-color: rgba(140,177,210,0);
        }
        .cluster-small > div {
            background-color: rgba(140,177,210,0.85);
            width: 24px;
            height: 24px;
            margin-left: 8px;
            margin-top: 8px;
            text-align: center;
            border-radius: 24px;
        }
        .cluster-small > div > span {
            line-height: 24px;
        }
        /* Medium */
        .cluster-medium {
            box-shadow: 0 0 6px rgba(255,255,255,0.15);
            background-color: rgba(97,147,179,0.4);
            margin-left: -30px;
            margin-top: -30px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
        }
        .cluster-medium > div {
            background-color: rgba(97,147,179,0.85);
            width: 44px;
            height: 44px;
            margin-left: 8px;
            margin-top: 8px;
            text-align: center;
            border-radius: 22px;
        }
        .cluster-medium > div > span {
            line-height: 44px;
        }
        .cluster-medium:hover {
          background-color: rgba(97,147,179,0.7);
        }
        .cluster-medium:hover > div {
          background-color: rgba(97,147,179,0);
        }
        /* Large */
        .cluster-large {
            box-shadow: 0 0 10px rgba(255,255,255,0.15);
            background-color: rgba(59,110,128,0.4);
            margin-left: -40px;
            margin-top: -40px;
            width: 80px;
            height: 80px;
            border-radius: 40px;
        }
        .cluster-large > div {
            background-color: rgba(59,110,128,0.85);
            width: 60px;
            height: 60px;
            margin-left: 10px;
            margin-top: 10px;
            text-align: center;
            border-radius: 30px;
        }
        .cluster-large:hover {
          background-color: rgba(59,110,128,1);
        }
        .cluster-large:hover {
          background-color: rgba(59,110,128,0.7);
        }
        .cluster-large:hover > div {
          background-color: rgba(59,110,128,0);
        }
        .cluster-large > div > span {
            line-height: 60px;
        }
        /* xLarge */
        .cluster-xlarge {
            box-shadow: 0 0 16px rgba(255,255,255,0.15);
            background-color: rgba(20,72,77,0.4);
            margin-left: -60px;
            margin-top: -60px;
            width: 120px;
            height: 120px;
            border-radius: 60px;
        }
        .cluster-xlarge:hover {
          background-color: rgba(20,72,77,0.7);
        }
        .cluster-xlarge:hover > div {
          background-color: rgba(20,72,77,0);
        }
        .cluster-xlarge > div {
            background-color: rgba(20,72,77,0.85);
            width: 100px;
            height: 100px;
            margin-left: 10px;
            margin-top: 10px;
            text-align: center;
            border-radius: 50px;
        }
        .cluster-xlarge > div > span {
            line-height: 100px;
        }

        /* Popup */
        .leaflet-popup-pane h3 {
          font-family:'Avenir LT W01 65 Medium';
        }
        .leaflet-popup-content-wrapper {
            border-radius: 6px;
            overflow: hidden;
        }
        .leaflet-popup-content {
            width: 250px;
            font-size: 14px;
        }
        .leaflet-popup-content p {
            margin: 1em 0;
            max-height: 150px;
            overflow-y: scroll;
        }
        .leaflet-popup-content h2 {
            margin-top: 15px;
        }

        .popup-bottom {
            background: #f2f2f2;
            margin: 1em -20px -1em;
            padding: .5em 20px;
        }
        .popup-bottom p {
            margin: .5em 0;
        }

        .popup-host {
            font-size: 12px;
            margin-left: -20px;
            margin-right: -20px;
            padding: 1px 20px;
            background-color: #d9d9d9;
        }

       .leaflet-popup-tip {
            background: #f2f2f2;
        }

        .marker {
            margin-left: -15px;
            margin-top: -15px;
            width: 30px;
            height: 30px;
            border-radius: 15px;
        }
        .marker path, .marker circle {
          fill: rgba(255, 255, 255, 0.9);
        }
        .marker > div {
          background-color: rgba(59,110,128,0.7);
          width: 14px;
          height: 14px;
          margin-left: 5px;
          margin-top: 5px;
          padding: 3px;
          text-align: center;
          border-radius: 14px;
        }
        .marker:hover {
          background-color: rgba(140,177,210,0.7);
        }
        /* .marker:hover > div {
          background-color: rgba(140,177,210,1);
        }*/

        /* Esri Geocode control */
        .geocoder-control-header {
            font-size: 11px;
            letter-spacing: 0.0725em;
        }

        .geocoder-control-suggestions .geocoder-control-suggestion.geocoder-control-selected,
        .geocoder-control-suggestions .geocoder-control-suggestion:hover {
            background-color: rgba(180,200,220,1);
        }

        .geocoder-control-expanded,
        .leaflet-touch .geocoder-control-expanded {
            width: 295px;
        }
    </style>
</head>

<body>
    <a href="https://github.com/esri/gis-day-map"><img style="position: absolute; top: 0; right: 0; border: 0; width: 100px; z-index:100;" src="https://camo.githubusercontent.com/e7bbb0521b397edbd5fe43e7f760759336b5e05f/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677265656e5f3030373230302e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_green_007200.png"></a>
    
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
        clusterLayer = L.esri.clusteredFeatureLayer('http://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/gisdayapp/FeatureServer/0', 
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
                new L.esri.Geocoding.Controls.Geosearch.Providers.FeatureLayer('http://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/gisdayapp/FeatureServer/0', {
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

</body>
</html>
```

## Requirements

* Notepad or your favorite HTML editor

## Resources

* [ArcGIS for JavaScript API Resource Center](http://developers.arcgis.com)
* [ArcGIS Blog](http://blogs.esri.com/esri/arcgis/)
* [twitter@esri](http://twitter.com/esrigeodev)

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.  Thank you!

* Directions - Uses OAuth and requires you to sign up for a [free ArcGIS Developer Subscription](https://developers.arcgis.com/en/sign-up/) to use the app.

## Contributing

Anyone and everyone is welcome to contribute. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing
Copyright 2013 Esri

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
