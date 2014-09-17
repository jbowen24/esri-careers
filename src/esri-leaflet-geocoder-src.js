/*! esri-leaflet-geocoder - v0.0.1-beta.5 - 2014-09-12
*   Copyright (c) 2014 Environmental Systems Research Institute, Inc.
*   Apache 2.0 License */

L.esri.Tasks.Geocode = L.esri.Tasks.Task.extend({

  params : {
    outSr: 4326,
    forStorage: false,
    outFields: '*',
    maxLocations: 20
  },

  setters: {
    'street': 'street',
    'neighborhood': 'neighborhood',
    'city': 'city',
    'subregion': 'subregion',
    'region': 'region',
    'postal': 'postal',
    'country': 'country',
    'address': 'address',
    'text': 'text',
    'category': 'category[]',
    'token' : 'token',
    'key': 'key',
    'fields': 'outFields[]',
    'forStorage': 'forStorage'
  },

  within: function(bounds){
    this.params.bbox = L.esri.Util.boundsToExtent(bounds);
  },

  nearby: function(latlng, radius){
    this.params.location = latlng.lng + "," + latlng.lat;
    this.params.distance = Math.min(Math.max(radius, 2000), 50000);
  },

  run: function(callback, context){
    this.path = (this.params.text) ? 'find' : 'findAddressCandidates';

    if(this.path === 'findAddressCandidates' && this.params.bbox) {
      this.params.searchExtent = this.params.bbox;
      delete this.params.bbox;
    }

    return this.request(function(error, response){
      var processor = (this.path === 'find') ? this._processFindResponse : this._processFindAddressCandidatesResponse;
      var results = (!error) ? processor(response) : undefined;
      callback.call(context, error, results, response);
    }, this);
  },

  _processFindResponse: function(response){
    var results = [];

    for (var i = 0; i < response.locations.length; i++) {
      var location = response.locations[i];
      var bounds = L.esri.Util.extentToBounds(location.extent);

      results.push({
        text: location.name,
        bounds: bounds,
        latlng: new L.LatLng(location.feature.geometry.y, location.feature.geometry.x),
        properties: location.feature.attributes
      });
    }

    return results;
  },

  _processFindAddressCandidatesResponse: function(response){
    var results = [];

    for (var i = 0; i < response.canidates.length; i++) {
      var canidate = response.canidates[i];
      var bounds = L.esri.Util.extentToBounds(canidate.extent);
      var properties = canidate.attributes;
      attributes.Score = canidate.score;

      results.push({
        text: canidate.address,
        bounds: bounds,
        latlng: new L.LatLng(canidate.location.y, canidate.location.x),
        properties :attributes
      });
    }

    return results;
  }

});
L.esri.Tasks.ReverseGeocode = L.esri.Tasks.Task.extend({
  path: 'reverseGeocode',
  params : {
    outSR: 4326
  },
  setters: {
    'distance': 'distance',
    'language': 'language'
  },
  latlng: function (latlng) {
    this.params.location = latlng.lng+',' + latlng.lat;
  },
  run: function(callback, context){
    var path = (this.params.text) ? 'find' : 'findAddressCandidates';

    return this.request(this.params, function(error, response){
      var result;
      if(!error){
        result = {
          latlng: new L.LatLng(response.location.y, response.location.x),
          properties: response.address
        };
      } else {
        result = undefined;
      }

      callback.call(context, error, result, response);
    }, this);
  }
});
L.esri.Tasks.Suggest = L.esri.Tasks.Task.extend({
  path: 'suggest',
  params : {},
  setters: {
    text: 'text',
    category: 'category'
  },
  within: function(bounds){
    bounds = bounds.pad(0.5);
    var center = bounds.getCenter();
    var ne = bounds.getNorthWest();
    this.params.location = center.lng + "," + center.lat;
    this.params.distance = Math.min(Math.max(center.distanceTo(ne), 2000), 50000);
  },
  nearby: function(latlng, radius){
    this.params.location = latlng.lng + "," + latlng.lat;
    this.params.distance = Math.min(Math.max(radius, 2000), 50000);
  },
  run: function(callback, context){
    return this.request(function(error, response){
      callback.call(context, error, response, response);
    }, this);
  }
});
L.esri.Services.Geocoding = L.esri.Services.Service.extend({
  statics: {
    WorldGeocodingService: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/',
    outFields: 'Subregion, Region, PlaceName, Match_addr, Country, Addr_type, City, Place_addr'
  },
  includes: L.Mixin.Events,
  initialize: function (url, options) {
    url = (typeof url === 'string') ? url : L.esri.Services.Geocoding.WorldGeocodingService;
    options = (typeof url === 'object') ? url : options;
    this.url = L.esri.Util.cleanUrl(url);
    L.Util.setOptions(this, options);
    L.esri.Services.Service.prototype.initialize.call(this, url, options);
  },
  geocode: function(){
    return new L.esri.Tasks.Geocode(this);
  },
  reverse: function(){
    return new L.esri.Tasks.ReverseGeocode(this);
  },
  suggest: function(){
    if(this.url !== L.esri.Services.Geocoding.WorldGeocodingService && console && console.warn){
      console.warn('Only the ArcGIS Online World Geocoder supports suggestions');
    }
    return new L.esri.Tasks.Suggest(this);
  }
});

L.esri.Services.geocoding = function(options){
  return new L.esri.Services.Geocoding(options);
};
L.esri.Controls.Geosearch = L.Control.extend({
  includes: L.Mixin.Events,
  options: {
    position: 'topleft',
    zoomToResult: true,
    useMapBounds: 12,
    collapseAfterResult: true,
    expanded: false,
    forStorage: false,
    allowMultipleResults: true,
    useArcgisWorldGeocoder: true,
    providers: []

  },
  initialize: function (options) {
    L.Util.setOptions(this, options);
    this._service = new L.esri.Services.Geocoding(options);
    this._service.on('authenticationrequired requeststart requestend requesterror requestsuccess', function (e) {
      e = L.extend({
        target: this
      }, e);
      this.fire(e.type, e);
    }, this);

    if(this.options.useArcgisWorldGeocoder){
      this.options.providers.push(new L.esri.Controls.Geosearch.Providers.ArcgisOnline());
    }

    if(this.options.maxResults){
      for (var i = 0; i < this.options.providers.length; i++) {
        this.options.providers[i].options.maxResults = this.options.maxResults;
      }
    }

    this._pendingSuggestions = [];
  },
  _geocode: function(text, key, provider){
    var activeRequests = 0;
    var allResults = [];
    var bounds;

    var callback = L.Util.bind(function(error, results){
      activeRequests--;

      // Single selection from suggestions
      if(results && key){
        allResults = allResults.concat(results[0]);
      } else {
        allResults = allResults.concat(results);
      }

      if(activeRequests <= 0){
        bounds = this._boundsFromResults(allResults);

        this.fire('results', {
          results: allResults,
          bounds: bounds,
          latlng: (bounds) ? bounds : undefined,
          text: text
        });

        if(this.options.zoomToResult && bounds){
          this._map.fitBounds(bounds);
        }

        L.DomUtil.removeClass(this._input, "geocoder-control-loading");

        this.fire('load');

        this.clear();

        this._input.blur();
      }
    }, this);

    if(key){
      activeRequests++;
      provider.results(this._map, text, key, this.options, callback);
    } else {
      for (var i = 0; i < this.options.providers.length; i++) {
        activeRequests++;
        this.options.providers[i].results(this._map, text, key, this.options, callback);
      }
    }
  },
  _suggest: function(text){
    L.DomUtil.addClass(this._input, "geocoder-control-loading");
    var activeRequests = this.options.providers.length;
    var allSuggestions = [];

    var createCallback = L.Util.bind(function(text, provider){
      return L.Util.bind(function(error, suggestions){
        activeRequests = activeRequests - 1;

        if(this._input.value < 2) {
          this._suggestions.innerHTML = "";
          this._suggestions.style.display = "none";
          return;
        }

        if(suggestions){
          for (var i = 0; i < suggestions.length; i++) {
            suggestions[i].provider = provider;
          }

          allSuggestions = allSuggestions.concat(suggestions);
        }

        if(activeRequests === 0 && this._input.value === text && allSuggestions.length){
          this._renderSuggestions(allSuggestions, provider);
          L.DomUtil.removeClass(this._input, "geocoder-control-loading");
        }
      }, this);
    }, this);

    this._pendingSuggestions = [];

    for (var i = 0; i < this.options.providers.length; i++) {
      var provider = this.options.providers[i];
      var request = provider.suggestions(this._map, text, this.options, createCallback(text, provider));
      this._pendingSuggestions.push(request);
    }
  },

  _renderSuggestions: function(suggestions){
    var currentGroup;
    this._suggestions.innerHTML = "";
    this._suggestions.style.display = "block";
    for (var i = 0; i < suggestions.length; i++) {
      var suggestion = suggestions[i];
      if(this.options.providers.length > 1 && currentGroup !== suggestion.provider.options.label){
        var header = L.DomUtil.create('span', "geocoder-control-header", this._suggestions);
        header.innerText = suggestion.provider.options.label;
        currentGroup = suggestion.provider.options.label;
      }
      var list = L.DomUtil.create('ul', "geocoder-control-list", this._suggestions);
      var suggestionItem = L.DomUtil.create('li', 'geocoder-control-suggestion', list);
      suggestionItem.innerHTML = suggestion.text;
      suggestionItem.provider = suggestion.provider;
      suggestionItem["data-magic-key"] = suggestion.magicKey;
    }
  },
  _boundsFromResults: function(results){
    if(!results.length){
      return;
    }

    var nullIsland = new L.LatLngBounds([0,0], [0,0]);
    var bounds = new L.LatLngBounds();

    for (var i = results.length - 1; i >= 0; i--) {
      var result = results[i];

      // make sure bounds are valid and not 0,0. sometimes bounds are incorrect or not present
      if(result.bounds.isValid() && !result.bounds.equals(nullIsland)){
        bounds.extend(result.bounds);
      }

      // ensure that the bounds include the results center point
      bounds.extend(result.latlng);
    }

    return bounds;
  },
  clear: function(){
    this._suggestions.innerHTML = "";
    this._suggestions.style.display = "none";
    this._input.value = "";

    if(this.options.collapseAfterResult){
      L.DomUtil.removeClass(this._wrapper, "geocoder-control-expanded");
    }
  },
  appendTo: function(node, map){
    node.appendChild(this.onAdd(map));
  },
  removeFrom: function(node){
    node.removeChild(this._container);

    if (this.onRemove) {
      this.onRemove(this._map);
    }

    this._map = null;
  },
  onAdd: function (map) {
    this._map = map;

    if (map.attributionControl) {
      map.attributionControl.addAttribution('Geocoding by Esri');
    }

    this._wrapper = L.DomUtil.create('div', "geocoder-control" + ((this.options.expanded) ? " " + "geocoder-control-expanded"  : ""));

    this._input = L.DomUtil.create('input', "geocoder-control-input leaflet-bar", this._wrapper);

    this._suggestions = L.DomUtil.create('div', "geocoder-control-suggestions leaflet-bar", this._wrapper);

    L.DomEvent.addListener(this._input, "focus", function(e){
      L.DomUtil.addClass(this._wrapper, "geocoder-control-expanded");
    }, this);

    L.DomEvent.addListener(this._wrapper, "click", function(e){
      L.DomUtil.addClass(this._wrapper, "geocoder-control-expanded");
      this._input.focus();
    }, this);

    L.DomEvent.addListener(this._suggestions, "mousedown", function(e){
      var suggestionItem = e.target || e.srcElement;
      this._geocode(suggestionItem.innerHTML, suggestionItem["data-magic-key"], suggestionItem.provider);
      this.clear();
    }, this);

    L.DomEvent.addListener(this._input, "blur", function(e){
      this.clear();
    }, this);

    L.DomEvent.addListener(this._input, "keydown", function(e){
      L.DomUtil.addClass(this._wrapper, "geocoder-control-expanded");

      var list = this._suggestions.querySelectorAll('.' + "geocoder-control-suggestion");
      var selected = this._suggestions.querySelectorAll('.' + "geocoder-control-selected")[0];
      var selectedPosition;

      for (var i = 0; i < list.length; i++) {
        if(list[i] === selected){
          selectedPosition = i;
          break;
        }
      }

      switch(e.keyCode){
      case 13:
        if(selected){
          this._geocode(selected.innerHTML, selected["data-magic-key"], selected.provider);
          this.clear();
        } else if(this.options.allowMultipleResults){
          this._geocode(this._input.value, undefined);
          this.clear();
        } else {
          L.DomUtil.addClass(list[0], "geocoder-control-selected");
        }
        L.DomEvent.preventDefault(e);
        break;
      case 38:
        if(selected){
          L.DomUtil.removeClass(selected, "geocoder-control-selected");
        }

        var previousItem = list[selectedPosition-1];

        if(selected && previousItem) {
          L.DomUtil.addClass(previousItem, "geocoder-control-selected");
        } else {
          L.DomUtil.addClass(list[list.length-1], "geocoder-control-selected");
        }
        L.DomEvent.preventDefault(e);
        break;
      case 40:
        if(selected){
          L.DomUtil.removeClass(selected, "geocoder-control-selected");
        }

        var nextItem = list[selectedPosition+1];

        if(selected && nextItem) {
          L.DomUtil.addClass(nextItem, "geocoder-control-selected");
        } else {
          L.DomUtil.addClass(list[0], "geocoder-control-selected");
        }
        L.DomEvent.preventDefault(e);
        break;
      default:
        // when the input changes we should cancel all pending suggestion requests if possible to avoid result collisions
        for (var x = 0; x < this._pendingSuggestions.length; x++) {
          if(this._pendingSuggestions[x] && this._pendingSuggestions[x].abort){
            this._pendingSuggestions[x].abort();
          }
        }
        break;
      }
    }, this);

    L.DomEvent.addListener(this._input, "keyup", L.Util.limitExecByInterval(function(e){
      var key = e.which || e.keyCode;
      var text = (e.target || e.srcElement).value;

      // require at least 2 characters for suggestions
      if(text.length < 2) {
        this._suggestions.innerHTML = "";
        this._suggestions.style.display = "none";
        L.DomUtil.removeClass(this._input, "geocoder-control-loading");
        return;
      }

      // if this is the escape key it will clear the input so clear suggestions
      if(key === 27){
        this._suggestions.innerHTML = "";
        this._suggestions.style.display = "none";
        return;
      }

      // if this is NOT the up/down arrows or enter make a suggestion
      if(key !== 13 && key !== 38 && key !== 40){
        this._suggest(text);
      }
    }, 50, this), this);

    L.DomEvent.disableClickPropagation(this._wrapper);

    return this._wrapper;
  },
  onRemove: function (map) {
    map.attributionControl.removeAttribution('Geocoding by Esri');
  }
});

L.esri.Controls.geosearch = function(url, options){
  return new L.esri.Controls.Geosearch(url, options);
};

L.esri.Controls.Geosearch.Providers = {};
L.esri.Controls.Geosearch.Providers.ArcgisOnline = L.esri.Services.Geocoding.extend({
  options: {
    label: "Places and Addresses",
    maxResults: 5
  },
  suggestions: function(map, text, options, callback){
    var request = this.suggest().text(text);

    if((options.useMapBounds === true || (options.useMapBounds <= map.getZoom())) && options.useMapBounds !== false){
      request.within(map.getBounds());
    }

    return request.run(function(error, results, response){
      var suggestions = [];
      if(!error){
        while(response.suggestions.length && suggestions.length <= (this.options.maxResults - 1)){
          var suggestion = response.suggestions.shift();
          if(!suggestion.isCollection){
            suggestions.push({
              text: suggestion.text,
              magicKey: suggestion.magicKey
            });
          }
        }
      }
      callback(error, suggestions);
    }, this);
  },

  results: function(map, text, key, options, callback){
    var request = this.geocode().text(text);

    if(key){
      request.key(key);
    } else {
      request.maxLocations(options.maxResults);
      if((options.useMapBounds === true || (options.useMapBounds <= map.getZoom())) && options.useMapBounds !== false){
        request.within(map.getBounds());
      }
    }

    if(this.options.forStorage){
      request.forStorage(true);
    }

    return request.run(callback, this);
  }
});

L.esri.Controls.Geosearch.Providers.arcgisOnline = function(options){
  return new L.esri.Controls.Geosearch.Providers.ArcgisOnline(options);
};
L.esri.Controls.Geosearch.Providers.FeatureLayer = L.esri.Services.FeatureLayer.extend({
  options: {
    label: 'Feature Layer',
    maxResults: 5,
    bufferRadius: 1000,
    formatSuggestion: function(feature){
      return feature.properties[this.options.searchFields[0]];
    }
  },
  intialize: function(url, options){
    L.esri.Services.FeatureLayer.prototype.call(this, url, options);
    L.Util.setOptions(this, options);
    if(typeof this.options.searchFields === 'string'){
      this.options.searchFields = [this.options.searchFields];
    }
  },
  suggestions: function(map, text, options, callback){
    var query = this.query().where(this._buildQuery(text))
                            .returnGeometry(false);

    if((options.useMapBounds === true || (options.useMapBounds <= map.getZoom())) && options.useMapBounds !== false){
      query.within(map.getBounds());
    }

    if(this.options.idField){
      query.fields([this.options.idField].concat(this.options.searchFields));
    }

    var request = query.run(function(error, results, raw){
      if(error){
        callback(error, []);
      } else {
        this.options.idField = raw.objectIdFieldName;
        var suggestions = [];
        var count = Math.min(results.features.length, this.options.maxResults);
        for (var i = 0; i < count; i++) {
          var feature = results.features[i];
          suggestions.push({
            text: this.options.formatSuggestion(feature),
            magicKey: feature.id
          });
        }
        callback(error, suggestions.slice(0, this.options.maxResults));
      }
    }, this);

    return request;
  },
  results: function(map, text, key, options, callback){
    var query = this.query();

    if(key){
      query.featureIds([key]);
    } else {
      query.where(this._buildQuery(text));
    }

    if((options.useMapBounds === true || (options.useMapBounds <= map.getZoom())) && options.useMapBounds !== false){
      query.within(map.getBounds());
    }

    return query.run(L.Util.bind(function(error, features){
      var results = [];
      for (var i = 0; i < features.features.length; i++) {
        var feature = features.features[i];
        if(feature){
          var bounds = this._featureBounds(feature);
          var result = feature.properties;
          result.latlng = bounds.getCenter();
          result.bounds = bounds;
          result.text = this.options.formatSuggestion(feature);
          results.push(result);
        }
      };
      callback(error, results);
    }, this));
  },
  _buildQuery: function(text){
    var queryString = [];

    for (var i = this.options.searchFields.length - 1; i >= 0; i--) {
      var field = this.options.searchFields[i];
      queryString.push(field + " LIKE '%"+text+"%'");
    }

    return queryString.join(' OR ');
  },
  _featureBounds: function(feature){
    var geojson = L.geoJson(feature);
    if(feature.geometry.type === 'Point'){
      var center = geojson.getBounds().getCenter();
      return new L. Circle(center, this.options.bufferRadius).getBounds();
    } else {
      return geojson.getBounds();
    }
  }
});

L.esri.Controls.Geosearch.Providers.featureLayer = function(url, options){
  return new L.esri.Controls.Geosearch.Providers.FeatureLayer(url, options);
};
L.esri.Controls.Geosearch.Providers.GeoJSON = L.Class.extend({
  options:{
    label: 'GeoJSON',
    maxResults: 5,
    bufferRadius: 1000,
    formatSuggestion: function(feature){
      return feature.properties[this.options.properties[0]];
    }
  },
  initialize: function(geojson, options){
    L.Util.setOptions(this, options);

    if(typeof this.options.properties === 'string'){
      this.options.properties = [this.options.properties];
    }

    this._features = {};

    for (var i = 0; i < geojson.features.length; i++) {
      var feature = geojson.features[i];
      feature.id = feature.id || i;
      this._features[feature.id] = feature;
    }

    var keys = [];

    for (var i = this.options.properties.length - 1; i >= 0; i--) {
      var key = this.options.properties[i];
      keys.push('properties.' + key);
    };

    this._fuse = new Fuse(geojson.features, {
      keys: keys,
      includeScore: true
    });
  },
  suggestions: function (map, text, options, callback) {
    var features = this._fuse.search(text);
    var suggestions = [];
    var mapBounds = map.getBounds();

    while(features.length && suggestions.length <= (this.options.maxResults - 1)){
      var feature = features.shift().item;

      if((options.useMapBounds === true || (options.useMapBounds <= map.getZoom())) && options.useMapBounds !== false){
        var geometry = L.geoJson(feature);
        if(!geometry.getBounds().intersects(mapBounds)){
          continue;
        }
      }

      suggestions.push({
        text: this.options.formatSuggestion(feature),
        magicKey: feature.id
      });
    }

    setTimeout(function(){
      callback(undefined, suggestions);
    }, 100);
  },
  results: function(map, text, key, options, callback){
    var search = key ? [{item:this._features[key]}] : this._fuse.search(text);
    var results = [];

    for (var i = 0; i < search.length; i++) {
      var feature = search[i].item;
      var result = feature.properties;
      var layer = L.GeoJSON.geometryToLayer(feature);
      var bounds = this._featureBounds(feature);

      result.text = this.options.formatSuggestion(feature);
      result.magicKey = feature.id;
      result.bounds = bounds;
      result.latlng = bounds.getCenter();
      results.push(result);
    }

    callback(undefined, results);
  },
  _featureBounds: function(feature){
    var geojson = L.geoJson(feature);
    if(feature.geometry.type === 'Point'){
      var center = geojson.getBounds().getCenter();
      return new L. Circle(center, this.options.bufferRadius).getBounds();
    } else {
      return geojson.getBounds();
    }
  }
});

L.esri.Controls.Geosearch.Providers.geoJson = function(geojson, options){
  return new L.esri.Controls.Geosearch.Providers.GeoJSON(geojson, options);
}
L.esri.Controls.Geosearch.Providers.GeocodeServer = L.esri.Services.Geocoding.extend({
  options: {
    label: 'Geocode Server',
    maxResults: 5,
    outFields: '*'
  },
  suggestions: function(map, text, options, callback){
    callback(undefined, []);
    return false;
  },
  results: function(map, text, key, options, callback){
    var request = this.geocode().text(text);

    request.maxLocations(options.maxResults);
    if((options.useMapBounds === true || (options.useMapBounds <= map.getZoom())) && !options.useMapBounds !== false){
      request.within(map.getBounds());
    }

    return request.run(callback, this);
  }
});

L.esri.Controls.Geosearch.Providers.geocodeServer = function(url, options){
  return new L.esri.Controls.Geosearch.Providers.GeocodeServer(url, options);
};
L.esri.Controls.Geosearch.Providers.MapService = L.esri.Services.MapService.extend({
  options: {
    label: 'Map Service',
    bufferRadius: 1000,
    maxResults: 5,
    formatSuggestion: function(feature){
      return feature.properties[this.options.searchFields[0]];
    }
  },
  initialize: function(url, options){
    L.esri.Services.MapService.prototype.initialize.call(this, url, options);
    this._getIdField();
    if(typeof this.options.searchFields === 'string'){
      this.options.searchFields = [this.options.searchFields];
    }
  },
  suggestions: function(map, text, options, callback){
    var request = this.find().text(text).returnGeometry(false).layers(this.options.layers);

    if(this._idField){
      request.fields(this.options.searchFields);
    }

    return request.run(function(error, results){
      var suggestions = [];

      if(this._idField && !error){
        var count = Math.min(this.options.maxResults, results.features.length);
        for (var i = 0; i < count; i++) {
          var suggestion = results.features[i];
          suggestions.push({
            text: this.options.formatSuggestion(feature),
            magicKey: suggestion.properties[this._idField]
          });
        }
      }

      callback(error, suggestions);
    }, this);
  },
  results: function(map, text, key, options, callback){
    var results = [];
    var request;

    if(key){
      request = this.find().text(text).contains(false).layers(this.options.layer);
    } else {
      request = this.query().layer(this.options.layer).featureIds(key);
    }

    if(this._idField){
      request.fields([this.options.searchFields, this.options._idField]);
    }

    request.run(function(error, features){
      if(this._idField && !error){
        for (var i = 0; i < features.features.length; i++) {
          var feature = features.features[i];
          if(feature){
            var bounds = this._featureBounds(feature);
            var result = feature.properties;
            result.latlng = bounds.getCenter();
            result.bounds = bounds;
            result.text = this.options.formatSuggestion(feature);
            results.push(result);
          }
        }
      }
      callback(error, results);
    }, this);
  },
  _featureBounds: function(feature){
    var geojson = L.geoJson(feature);
    if(feature.geometry.type === 'Point'){
      var center = geojson.getBounds().getCenter();
      return new L. Circle(center, this.options.bufferRadius).getBounds();
    } else {
      return geojson.getBounds();
    }
  },
  _getIdField: function(){
    this.get(this.options.layer, {}, function(error, metadata){
      for (var i = 0; i < metadata.fields.length; i++) {
        var field = metadata.fields[i];
        if(field.type === 'esriFieldTypeOID'){
          this.options.searchFields.push(field.name)
          break;
        }
      }
    }, this);
  }
});

L.esri.Controls.Geosearch.Providers.mapService = function(url, options){
  return new L.esri.Controls.Geosearch.Providers.MapService(url, options);
};