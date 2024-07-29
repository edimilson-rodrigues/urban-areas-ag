/* 
======================================

### Mosaic Gen  ###
Origin Collection: 7  and adapted to others

=======================================
*/

var Mosaic = 'Col9Urb_v0'; 

var F_PreProcess = require('users/mayhirye/Publ:MBUrb_Col9/F_PreProcess_Landsat');
var F_Indexes = require('users/mayhirye/Publ:MBUrb_Col9/F_Indexes_Landsat');
var Bands = require('users/mayhirye/Publ:MBUrb_Col9/L_Bands');


// Função para obtenção do mosaico
var getMosaic = function(year, geometry){

// Bandas utilizadas
var BandsSRLT05 = ['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B7']; // surface reflectance  collection 2
var BandsSRLE07 = ['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B7']; // surface reflectance  collection 2
var BandsSRLC08 = ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7']; // surface reflectance  collection 2
var BandsSRLC09 = ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7']; // surface reflectance  collection 2
var BandsSRRename = ['BLUE', 'GREEN', 'RED', 'NIR', 'SWIR1', 'SWIR2'];

var BandsRawLT05 = ['B4', 'B5', 'B6']; // raw image  collection 2
var BandsRawLE07 = ['B4', 'B5', 'B6_VCID_1']; // raw image  collection 2
var BandsRawLC08 = ['B5', 'B6', 'B10']; // raw image  collection 2
var BandsRawLC09 = ['B5', 'B6', 'B10']; // raw image  collection 2
var BandsRawRename = ['NIR', 'MIR', 'TIR'];

var listBands = ee.List(Bands.Col9).getInfo();


// Criação ImageCollection Landsat 05 - Surface Reflectance
  var datasetSR_LT05 = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
     .filterDate(year+'-01-01', year+'-12-31')
     .filterBounds(geometry)
     .map(F_PreProcess.maskClouds_SR)
     .map(F_PreProcess.applyScaleFactors);
  datasetSR_LT05 = datasetSR_LT05.select(BandsSRLT05)
                                 .map(function(image){return image.rename(BandsSRRename)})
                                 .map(function(image){return image.select(BandsSRRename)});


// Criação ImageCollection Landsat 07 - Surface Reflectance
  var datasetSR_LE07 = ee.ImageCollection('LANDSAT/LE07/C02/T1_L2')
     .filterDate(year+'-01-01', year+'-12-31')
     .filterDate('2010-01-01', '2016-12-31')
     .filterBounds(geometry)
     .map(F_PreProcess.maskClouds_SR)
     .map(F_PreProcess.applyScaleFactors);

  datasetSR_LE07 = datasetSR_LE07.select(BandsSRLE07)
                                 .map(function(image){return image.rename(BandsSRRename)})
                                 .map(function(image){return image.select(BandsSRRename)});


// Criação ImageCollection Landsat 08 - Surface Reflectance
  var datasetSR_LC08 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
      .filterDate(year+'-01-01', year+'-12-31')
      .filterBounds(geometry)
      .map(F_PreProcess.maskClouds_SR)
      .map(F_PreProcess.applyScaleFactors);
  datasetSR_LC08 = datasetSR_LC08.select(BandsSRLC08)
                                .map(function(image){return image.rename(BandsSRRename)})
                                .map(function(image){return image.select(BandsSRRename)});

// Criação ImageCollection Landsat 09 - Surface Reflectance
  var datasetSR_LC09 = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
      .filterDate(year+'-01-01', year+'-12-31')
      .filterBounds(geometry)
      .map(F_PreProcess.maskClouds_SR)
      .map(F_PreProcess.applyScaleFactors);
  datasetSR_LC09 = datasetSR_LC09.select(BandsSRLC09)
                                .map(function(image){return image.rename(BandsSRRename)})
                                .map(function(image){return image.select(BandsSRRename)});



// Criação ImageCollection Landsat 05 - Raw
  var datasetRaw_LT05 = ee.ImageCollection('LANDSAT/LT05/C02/T1')
      .filterDate(year+'-01-01', year+'-12-31')
      .filterBounds(geometry)
      .map(F_PreProcess.maskClouds_Raw);
  datasetRaw_LT05 = datasetRaw_LT05.select(BandsRawLT05)
                                   .map(function(image){return image.rename(BandsRawRename)});


// Criação ImageCollection Landsat 07 - Raw
  var datasetRaw_LE07 = ee.ImageCollection('LANDSAT/LE07/C02/T1')
      .filterDate(year+'-01-01', year+'-12-31')
      .filterDate('2010-01-01', '2016-12-31')
      .filterBounds(geometry)
      .map(F_PreProcess.maskClouds_Raw);
  datasetRaw_LE07 = datasetRaw_LE07.select(BandsRawLE07)
                                   .map(function(image){return image.rename(BandsRawRename)});


// Criação ImageCollection Landsat 08 - Raw
  var datasetRaw_LC08 = ee.ImageCollection('LANDSAT/LC08/C02/T1')
     .filterDate(year+'-01-01', year+'-12-31')
     .filterBounds(geometry)
     .map(F_PreProcess.maskClouds_Raw);
  datasetRaw_LC08 = datasetRaw_LC08.select(BandsRawLC08)
                                   .map(function(image){return image.rename(BandsRawRename)});


// Criação ImageCollection Landsat 09 - Raw
  var datasetRaw_LC09 = ee.ImageCollection('LANDSAT/LC09/C02/T1')
     .filterDate(year+'-01-01', year+'-12-31')
     .filterBounds(geometry)
     .map(F_PreProcess.maskClouds_Raw);
  datasetRaw_LC09 = datasetRaw_LC09.select(BandsRawLC09)
                                   .map(function(image){return image.rename(BandsRawRename)});



// Junção ImageCollection - Surface Reflectance

  var datasetSR = datasetSR_LT05.merge(datasetSR_LE07.merge(datasetSR_LC08).merge(datasetSR_LC09));

  var datasetSR_median = datasetSR.reduce(ee.Reducer.median()).multiply(1000).toUint16();



// Junção ImageCollection - Raw
  var datasetRaw = datasetRaw_LT05.merge(datasetRaw_LE07.merge(datasetRaw_LC08).merge(datasetRaw_LC09));

  var datasetRaw_median = datasetRaw.reduce(ee.Reducer.median()).multiply(1000).toUint16();



// Cálculo de índices
  var datasetSR_indexes1 = datasetSR_median
                                .addBands(datasetSR.map(F_Indexes.calcNDVI).reduce(ee.Reducer.median()).add(1).multiply(1000).toUint16())
                                .addBands(datasetSR.map(F_Indexes.calcEVI).reduce(ee.Reducer.median()).add(1).multiply(1000).toUint16())
                                .addBands(datasetSR.map(F_Indexes.calcEVI2).reduce(ee.Reducer.median()).add(1).multiply(1000).toUint16())
                                .addBands(datasetSR.map(F_Indexes.calcMNDWI).reduce(ee.Reducer.median()).add(1).multiply(1000).toUint16())
                                .addBands(datasetSR.map(F_Indexes.calcNDWIm).reduce(ee.Reducer.median()).add(1).multiply(1000).toUint16())
                                .addBands(datasetSR.map(F_Indexes.calcNDBI).reduce(ee.Reducer.median()).add(1).multiply(1000).toUint16())
                                .addBands(datasetSR.map(F_Indexes.calcNBR).reduce(ee.Reducer.median()).add(1).multiply(1000).toUint16()) 
                                .addBands(datasetSR.map(F_Indexes.calcNDRI).reduce(ee.Reducer.median()).add(1).multiply(1000).toUint16())
                                .addBands(datasetSR.map(F_Indexes.calcBAI).reduce(ee.Reducer.median()).add(1).multiply(1000).toUint16())
                                .addBands(datasetSR.map(F_Indexes.calcUI).reduce(ee.Reducer.median()).add(1).multiply(1000).toUint16())
                                .addBands(datasetSR.map(F_Indexes.calcNDUI).reduce(ee.Reducer.median()).add(1).multiply(1000).toUint16())
                                .addBands(datasetSR.map(F_Indexes.calcBSI).reduce(ee.Reducer.median()).add(1).multiply(1000).toUint16())
                                .addBands(datasetSR.map(F_Indexes.calcSMA).reduce(ee.Reducer.median()).toUint16())
                                .addBands(datasetSR.map(F_Indexes.calcSMASmall).reduce(ee.Reducer.median()).toUint16());

  var BU = datasetSR.map(F_Indexes.addNDVI).map(F_Indexes.addNDBI);
  BU = BU.map(F_Indexes.calcBU).reduce(ee.Reducer.median()).add(1).multiply(1000).toUint16();
  BU = BU.select('BU_median');

  var NDFI = datasetSR.map(F_Indexes.addSMA);
  NDFI = NDFI.map(F_Indexes.calcNDFI).reduce(ee.Reducer.median()).toUint16();

  var EVI_p= datasetSR.map(F_Indexes.calcEVI).reduce(ee.Reducer.percentile([10,90])).add(1).multiply(1000).toUint16();
  var EVI_dif9010 = EVI_p.select('EVI_p90').subtract(EVI_p.select('EVI_p10')).rename('EVI_dif9010').toUint16();
  var EVIs = EVI_p.addBands(EVI_dif9010);

  var EVI2_p= datasetSR.map(F_Indexes.calcEVI2).reduce(ee.Reducer.percentile([10,90])).add(1).multiply(1000).toUint16();
  var EVI2_dif9010 = EVI2_p.select('EVI2_p90').subtract(EVI2_p.select('EVI2_p10')).rename('EVI2_dif9010').toUint16();
  var EVI2s = EVI2_p.addBands(EVI2_dif9010);

  var EBBI = datasetRaw.map(F_Indexes.calcEBBI).median().rename('EBBI_median').multiply(1000).toInt16();
  var EBBI_p75 = datasetRaw.map(F_Indexes.calcEBBI).reduce(ee.Reducer.percentile([75])).rename('EBBI_p90').multiply(1000).toInt16();
  var EBBI_p25 = datasetRaw.map(F_Indexes.calcEBBI).reduce(ee.Reducer.percentile([25])).rename('EBBI_p25').multiply(1000).toInt16();
  var EBBI_dif7525 = EBBI_p75.subtract(EBBI_p25).rename('EBBI_dif7525').toInt16();
  var EBBIsNeg = datasetRaw.map(F_Indexes.calcEBBI).median().rename('EBBIsNeg_median').multiply(1000).toUint16();
  var EBBIsNeg_p75 = datasetRaw.map(F_Indexes.calcEBBI).reduce(ee.Reducer.percentile([75])).rename('EBBIsNeg_p75').multiply(1000).toUint16();
  var EBBIsNeg_p25 = datasetRaw.map(F_Indexes.calcEBBI).reduce(ee.Reducer.percentile([25])).rename('EBBIsNeg_p25').multiply(1000).toUint16();
  var EBBIsNeg_dif7525 = EBBIsNeg_p75.subtract(EBBIsNeg_p25).rename('EBBIsNeg_dif7525').toUint16();
  var EBBIs = EBBI.addBands(EBBI_p75).addBands(EBBI_p25).addBands(EBBI_dif7525)
                .addBands(EBBIsNeg).addBands(EBBIsNeg_p75).addBands(EBBIsNeg_p25).addBands(EBBIsNeg_dif7525);


// Mosaico Final
var col = datasetSR_indexes1.addBands(BU).addBands(NDFI).addBands(EVIs).addBands(EVI2s).addBands(EBBIs);
  return col;
};


//Exporta a função
exports.getMosaic = getMosaic;
