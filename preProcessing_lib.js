/* 
======================================

### PreProcess ###
Urban Area Mapping
Collection: 9
contact: ma.hirye@alumni.usp.br

=======================================
*/


// Função - Scaling factors - Surface Reflectance
  exports.applyScaleFactors = function (image) {
    var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2); 
    return image.addBands(opticalBands, null, true);
  };


// Função - Mask clouds - Surface Reflectance
// QA_PIXEL = Pixel quality attributes generated from the CFMASK algorithm (Foga et al., 2017).
  exports.maskClouds_SR = function (image) {

    var cloudShadowBitMask = (1 << 4); // Bits 4 are clouds shadows
    var cloudsBitMask = (1 << 3); // Bits 3 are clouds
    var qa = image.select("QA_PIXEL");
    var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
      .and(qa.bitwiseAnd(cloudsBitMask).eq(0)); // Both flags should be set to zero, indicating clear conditions.
    return image.updateMask(mask);
  };


// Função - Mask clouds - Raw
// Landsat Collection 2 QA Bitmask
  exports.maskClouds_Raw = function (image) {
    return image.updateMask(image.select('QA_PIXEL').bitwiseAnd(parseInt('11010', 2)).eq(0));
  };
