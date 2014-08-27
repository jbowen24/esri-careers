require 'json'
require 'open-uri'

map = open('http://www.esri.com/Events/GISDay/Map').read
points = map.match(/points = (.*)$/)[1].gsub(/;/,'')
locations_raw = JSON.parse(points)
locations = {
  "objectIdFieldName" => "id",
  "globalIdFieldName" => "",
  "hasZ" => false,
  "hasM" => false,
  "geometryType" => "esriGeometryPoint",
  "spatialReference" => {
  "wkid" => 4326
  },
  fields: [],
  features: []
}

locations_raw.first.each do |k,v|
  locations[:fields] << {
      name: k,
      type: "esriFieldTypeString",
      "alias" => k
      } unless k =~ /^[xy]$/
end

locations_raw.each do |l|
  l[:geometry] = {x: l.delete('x'), y: l.delete('y'), spatialReference: {wkid: 102100} }
  locations[:features] << l
end


File.open('locations.json','w') { |file| file << locations.to_json }