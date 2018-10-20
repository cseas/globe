// Objects you can display:
// 1. placemark
// 2. polygons
// 3. complex 3d models
// 4. map imagery service

var wwd = new WorldWind.WorldWindow("canvasOne");

// Imagery layers
wwd.addLayer(new WorldWind.BMNGOneImageLayer());
// wwd.addLayer(new WorldWind.BMNGLandsatLayer());
wwd.addLayer(new WorldWind.BingAerialWithLabelsLayer(null));

// Compass, coordinates and view controls
// wwd.addLayer(new WorldWind.CompassLayer());
wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
// wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));
wwd.addLayer(new WorldWind.AtmosphereLayer());



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
// placemarkLayer.addRenderable(placemark);



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

// in terms of latitude, longitude and altitude, 
// we define the boundaries of the polygon 
// using an array of WorldWind.Position objects
var boundaries = [];
boundaries.push(new WorldWind.Position(20.0, -75.0, 700000.0));
boundaries.push(new WorldWind.Position(25.0, -85.0, 700000.0));
boundaries.push(new WorldWind.Position(20.0, -95.0, 700000.0));
// display our shape as an extrusion from the surface of the Earth
var polygon = new WorldWind.Polygon(boundaries, polygonAttributes);
polygon.extrude = true;
// polygonLayer.addRenderable(polygon);



// display more complex 3D shapes from external sources, 
// like COLLADA 3D model files
var modelLayer = new WorldWind.RenderableLayer();
wwd.addLayer(modelLayer);
// a WorldWind.Position object in terms of latitude, longitude, and altitude
var position = new WorldWind.Position(10.0, -125.0, 800000.0);
// a configuration object containing a dirPath attribute that points 
// towards a folder where many .dae files may be located
var config = {dirPath: WorldWind.configuration.baseUrl + 'examples/collada_models/duck/'};
// feed both parameters to the ColladaLoader constructor
var colladaLoader = new WorldWind.ColladaLoader(position, config);
// use the load function of ColladaLoader to retrieve the model file that we desire
// colladaLoader.load("duck.dae", function (colladaModel) {
//     colladaModel.scale = 9000;
//     modelLayer.addRenderable(colladaModel);
// });



// Accessing a map imagery service
// Retrieve an imagery layer from NASA Earth Observations WMS
// We’ll need the WMS address alongside its WMS’s GetCapabilities request
var serviceAddress = "https://neo.sci.gsfc.nasa.gov/wms/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0";
// choose average temperature over land
var layerName = "MOD_LSTD_CLIM_M";
var createLayer = function (xmlDom) {
    var wms = new WorldWind.WmsCapabilities(xmlDom);
    var wmsLayerCapabilities = wms.getNamedLayer(layerName);
    var wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(wmsLayerCapabilities);
    var wmsLayer = new WorldWind.WmsLayer(wmsConfig);
    wwd.addLayer(wmsLayer);
};
// handle errors
var logError = function (jqXhr, text, exception) {
    console.log("There was a failure retrieving the capabilities document: " +
        text +
    " exception: " + exception);
};
// display
// $.get(serviceAddress).done(createLayer).fail(logError);



// Create the Blue Marble time series layer using REST tiles hosted at worldwind32.arc.nasa.gov.
// Disable it until its images are cached, which is initiated below.
var timeSeriesLayer = new WorldWind.BMNGRestLayer(
    "https://worldwind32.arc.nasa.gov/standalonedata/Earth/BlueMarble256"
    );
timeSeriesLayer.enabled = false;
timeSeriesLayer.showSpinner = true;
wwd.addLayer(timeSeriesLayer);

// Add atmosphere layer on top of base imagery layer.
wwd.addLayer(new WorldWind.AtmosphereLayer());

var timeIndex = 0;
var animationStep = 200;

function animateTimeSeries() {
            // Pre-load all of the time series layer data before starting the animation, so that we don't see image
            // tiles flashing as they're downloaded.
            if (!timeSeriesLayer.isPrePopulated(wwd)) {
                timeSeriesLayer.prePopulate(wwd);
                return;
            }

            // Increment the Blue Marble layer's time at a specified frequency.
            timeIndex = ++timeIndex % WorldWind.BMNGRestLayer.availableTimes.length;
            timeSeriesLayer.time = WorldWind.BMNGRestLayer.availableTimes[timeIndex];
            timeSeriesLayer.enabled = true;
            timeSeriesLayer.showSpinner = false;
            layerManager.synchronizeLayerList();
            wwd.redraw();
}

// Run the animation at the desired frequency.
window.setInterval(animateTimeSeries, animationStep);

        // Create a layer manager for controlling layer visibility.
// var layerManager = new LayerManager(wwd);