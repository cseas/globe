var wwd = new WorldWind.WorldWindow("canvasOne");

// Imagery layers
wwd.addLayer(new WorldWind.BMNGOneImageLayer());
wwd.addLayer(new WorldWind.BMNGLandsatLayer());

// Compass, coordinates and view controls
wwd.addLayer(new WorldWind.CompassLayer());
wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

// Drawing Placemarks
var placemarkLayer = new WorldWind.RenderableLayer("Placemark");
wwd.addLayer(placemarkLayer);
// Placemark attributes object
var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
// image offset
placemarkAttributes.imageOffset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.3,
    WorldWind.OFFSET_FRACTION, 0.0);
// label offset
placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);
// image for placemark
placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/pushpins/plain-red.png";
// creation of a placemark at 55° N latitude, 106° W longitude and 100 meters altitude looks like this
var position = new WorldWind.Position(55.0, -106.0, 100.0);
var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);
// placemark label
placemark.label = "Placemark\n" +
    "Lat " + placemark.position.latitude.toPrecision(4).toString() + "\n" +
    "Lon " + placemark.position.longitude.toPrecision(5).toString();
placemark.alwaysOnTop = true;
// add it to the previously created placemarkLayer
// We could keep adding more placemarks to placemarkLayer if we desire
placemarkLayer.addRenderable(placemark);


// Display 3D Shapes
// layer to store polygon
var polygonLayer = new WorldWind.RenderableLayer();
wwd.addLayer(polygonLayer);
// Attributes object
var polygonAttributes = new WorldWind.ShapeAttributes(null);
polygonAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.75);
polygonAttributes.outlineColor = WorldWind.Color.BLUE;
polygonAttributes.drawOutline = true;
polygonAttributes.applyLighting = true;

var boundaries = [];
boundaries.push(new WorldWind.Position(20.0, -75.0, 700000.0));
boundaries.push(new WorldWind.Position(25.0, -85.0, 700000.0));
boundaries.push(new WorldWind.Position(20.0, -95.0, 700000.0));