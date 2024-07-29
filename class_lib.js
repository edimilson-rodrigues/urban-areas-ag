/* 
======================================
### Classification Library  ###
Origin Collection: 5
Revision: 9
=======================================
*/

//Training sample preparation
var getFeatureSpace = function(image, samples){

  samples = image.sampleRegions({
    collection:samples,
    scale:30,
    geometries:true,
    tileScale:16
    });

  return ee.FeatureCollection(samples);

};



  var classifyLandsat = function(bands, samples, ntree, image_class){

    var classifier = ee.Classifier.smileRandomForest({
      numberOfTrees:ntree,
      minLeafPopulation:20,
      seed:24})
      .train({
        'features':samples,
        'classProperty':'value',
        'inputProperties':bands
      })
      .setOutputMode('PROBABILITY')
    ;

    print("explain classifier", classifier.explain());

    var classified = image_class.classify(classifier);
    return classified.multiply(100).byte();

  }; 



  var CalcClassifier = function(bands, samples, ntree){

    var classifier = ee.Classifier.smileRandomForest({
      numberOfTrees:ntree,
      minLeafPopulation:20,
      seed:24})
      .train({
        'features':samples,
        'classProperty':'value',
        'inputProperties':bands
      })
      .setOutputMode('PROBABILITY')
    ;

    //print("explain classifier", classifier.explain());

    return classifier;

  }; 



  var OnlyClassify = function(CLASSIFIER, image_class){

    var classified = image_class.classify(CLASSIFIER);
    return classified.multiply(100).byte();

  }; 



////////////////////////////////////////////////////////////
//exports.getFeatureSpace = getFeatureSpace;
//exports.runRandomForest = runRandomForest;
exports.classifyLandsat = classifyLandsat;
exports.CalcClassifier = CalcClassifier;
exports.OnlyClassify = OnlyClassify;
