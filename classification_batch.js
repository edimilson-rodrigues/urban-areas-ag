/*  
======================================
### Classification Batch ###
Origin Collection: 7
Revison: 9
=======================================
*/

=======================================
*/

// Info 
var Col = "9";
var mosaic_version = "Col9Urb_v0";  
var samples_version = "v5_balanced2";
var prob_version = '3'; 
var desc = "Probability, version: "+prob_version+ ", samples version: "+samples_version+ ", mosaic version: "+mosaic_version;


var assetPath = 'projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA8_1-Prob';  // ***CHANGE*** results path
var listYearsMosaics = ee.List.sequence(1985, 2023, 1).getInfo(); // ***CHANGE*** mosaic years


var class_lib = require('users/mayhirye/Publ:MBUrb_Col9/F_Class_Lib');
var mosaicGen = require('users/mayhirye/Publ:MBUrb_Col9/F_MosaicGen_Landsat');     
var Bands = require('users/mayhirye/Publ:MBUrb_Col9/L_Bands');
var Grids = require('users/mayhirye/Publ:MBUrb_Col9/L_GridsModels');

var path_samples_urb = 'projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA9/SAMPLES/Urb';
var path_samples_nurb = 'projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA9/SAMPLES/NUrb';

var cartas_hex_col = ee.FeatureCollection('projects/ee-mburb-land/assets/LandsatCol9_Inputs/Cartas_250mil_Hex');
var cartas_col = ee.FeatureCollection('projects/ee-mburb-land/assets/LandsatCol9_Inputs/Cartas_250mil');
var cartas_balance_samples = ee.FeatureCollection("projects/ee-mburb-land/assets/LandsatCol9_Inputs/SamplesSize_2_CorrToCol9_AllGrids");

var listBands = ee.List(Bands.Col9).getInfo();

var listGrids = Grids.Dict_Grids_Models.keys();
listGrids = listGrids.getInfo();

print("listGrids", listGrids);


var export2col = function(image,grid,roi,year){
  Export.image.toAsset({
      "image": image,
      "description": "Cartas_Prob_" + grid + '-' + year,
      "assetId": assetPath + "/" + grid + '-' + year + '_' + prob_version,
      "region": roi,
      "scale": 30,
      "maxPixels": 1e13
  });
};

var export2Drive = function(COLLECTION,DESC,FOLD,FORMAT){
    Export.table.toDrive({
      collection:COLLECTION,
      description: DESC,
      folder: FOLD,
      fileFormat: FORMAT
    });
};

var getCount = function(image, geometry){
  var areaImage = ee.Image.pixelArea();
  areaImage = areaImage.multiply(image);
  var stat = areaImage.reduceRegion({
                reducer: ee.Reducer.count(),
                geometry: geometry.geometry(),
                scale: 30,
                maxPixels: 1e9
              });
  var pix = stat.get('area');
  return pix;
};

  


  listYearsMosaics.forEach(function(year){
    
    //print ('>>>>>> ' + desc + " / " + year + ' <<<<<<');
    
    var samples_urban = ee.FeatureCollection(path_samples_urb+"/Samples_Urb_Train_v5_"+year);
    var samples_nurban = ee.FeatureCollection(path_samples_nurb+"/Samples_NUrb_Train_v5_"+year);
    //print("samples_urban grid", samples_urban.aggregate_array("grid_name").distinct());
    //Map.addLayer(samples_urban, {}, "samples_urban");
    
    var imCol_AllCols = ee.ImageCollection([]);
    var cartas_hex_Class = ee.ImageCollection([]);
    var cartas_Class_info = ee.FeatureCollection([]);
    
    
    var list_assets_grids = ee.ImageCollection(assetPath).filter(ee.Filter.eq("year", year)).aggregate_array("grid");
    
    listGrids.forEach(function(grid){
      //print ('>>>>> ' + "Grid: " + grid + ' <<<<<');
      
      var carta_hex = cartas_hex_col.filter(ee.Filter.eq("grid_name", grid));
      //Map.centerObject(carta_hex);
      
      var carta = cartas_col.filter(ee.Filter.eq("grid_name", grid));
      
      
      var samples_urban_size = samples_urban.filterBounds(carta.geometry()).size();
      //print("samples_urban_size", samples_urban_size);
      var samples_nurban_size = samples_nurban.filterBounds(carta.geometry()).size(); 
      //print("samples_nurban_size", samples_nurban_size);
      
      
      var grid_Model = Grids.Dict_Grids_Models.get(grid).getInfo();
      //print ('>>> ' + "Grid Model if necessary: " + grid_Model + ' <<<');
      
      grid_Model = ee.Algorithms.If(samples_urban_size.and(samples_nurban_size).eq(1), grid, grid_Model).getInfo();
      //print ('>>> ' + "Grid Model used: " + grid_Model + ' <<<');
      
      var carta_Model = cartas_col.filter(ee.Filter.eq("grid_name", grid_Model));
      //Map.addLayer(carta_Model, {}, "carta_model");
      
      var carta_balance_samples = cartas_balance_samples.filter(ee.Filter.eq("grid_name", grid_Model));
      //print("carta_balance_samples", carta_balance_samples);
      var balance_urban = carta_balance_samples.first().get("Urb_size_corr_"+year).getInfo();
      //print("balance_urban", balance_urban);
      var balance_nurban = carta_balance_samples.first().get("NUrb_size_corr_"+year).getInfo();
      //print("balance_nurban", balance_nurban);
      
      var samples_urban_model = samples_urban.filterBounds(carta_Model.geometry()).randomColumn("random",24).sort("random").limit(balance_urban);
      //print("size of samples_urban_model", samples_urban_model.size());
      var samples_nurban_model = samples_nurban.filterBounds(carta_Model.geometry()).randomColumn("random",24).sort("random").limit(balance_nurban);
      //print("size of samples_nurban_model", samples_nurban_model.size());
      
      var samples = samples_urban_model.merge(samples_nurban_model);
      //print("size of samples", samples.size());
      //Map.addLayer(samples, {}, "samples");
      
      
      var imCol = ee.ImageCollection([]);
      
      
      var carta_hex_Class = cartas_hex_col.filter(ee.Filter.eq("grid_name", grid));
      
      
      var mosaic_Class = mosaicGen.getMosaic(year, carta_hex_Class).clip(carta_hex_Class).select(listBands);
      //print("mosaic_Class", mosaic_Class);
      //Map.addLayer(mosaic_Class, {bands:["SWIR1_median","NIR_median","RED_median"], max:600, min:50}, "mosaic_Class", false);
      
      
      var classifier = class_lib.CalcClassifier(listBands, samples, 500);
      //print("classifier", classifier.explain());
      
      
      var classified = class_lib.OnlyClassify(classifier, mosaic_Class);
      classified = ee.Image(classified).toByte();
      //Map.addLayer(classified, {}, "classified");
      
      classified = classified
        .set('territory', 'BRAZIL')
        .set('theme', 'Urban Area')
        .set('version', prob_version)
        .set('source', 'GT URBANO')
        .set('collection_id', Col)
        .set('year', year)
        .set('grid', grid)
        .set('grid_Model', grid_Model)
        .set('Mosaic_version', mosaic_version)
        .set('Samples_version', samples_version)
        .set("description", desc)
      ;
      
      //Map.addLayer(classified, {}, "classified");
      
      classified = ee.Image(classified).toByte();
      export2col(classified, grid, carta_hex_Class, year);
      //Map.addLayer(classified, {bands:["classification"], min:0, max:100, palette:["37ff00","ff0000"]},"classified "+grid, false);
      //Map.addLayer(classified.gte(50), {bands:["classification"], min:0, max:1, palette:["#ffffff","#af2a2a"]},"classified Urb"+grid);
      
      
    });
    
    
  });
