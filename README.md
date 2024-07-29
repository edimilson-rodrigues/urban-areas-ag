<div class="fluid-row" id="header">
    <div id="column">
        <div class = "blocks">
            <img src='Image/LogosMapBiomasUAgroup-rev2.png' height='auto' width='auto' align='right'>
        </div>
    </div>
    <h1 class="title toc-ignore">Urban Area</h1>
</div>

Developed by MapBiomas Urban Areas Mapping Group, composed by students and researchers from:
- LabCart <br/>
- LASERE <br/>
- NEEPC <br/>
- NEPA <br/>
- QUAPÁ <br/>
- YBY <br/>
- UFBA <br/>

# About
This documentation contains general information about the urban areas mapping procedures developed by MapBiomas project in Collection 9 products. Both the concepts that were applied and the main accuracy results are detailed in the Algorithm Theoretical Basis Document (ATBD) about urban areas (see https://mapbiomas.org/). Here we highlight the sequential procedures to classify urban areas from satellite imagery and reference base-maps.<br/>

# How to use
## Basics
Some basic steps are necessary before starting programming. They are:<br/> 
- Create an account in the GEE platform. It can be done here https://earthengine.google.com/<br/>
- Create a GEE repository in the code editor and upload the modules in it. <br/>

The modules necessary are shown in Tables 1 and 2.<br/>

_Table 1 - Basic classification codes._
|Codes| General description
|:---|:---
**preProcessing_lib.js** | Code with functions to scale surface reflectance images and remove cloud and shadow clouds.
**renameBands.js** | Code with list of bands used to create feature space.
**index_lib.js** | Library with index calculation functions used during the mosaic production.
**mosaic_production.js** | Generates mosaics from Landsat images from 1985 to 2023.
**gridModels.js** | Alternative grids to perform Random Forest.
**class_lib.js** | Sets up a classification procedure using Random Forest (RF) algorithm.
**classification_batch.js** | Perform the classification using mosaics, samples, and the classifier.
<br/>

_Table 2 - Spatial and temporal classification codes._
|Codes| General description
|:---|:---|
|**best_thresholds.js**| Calculates the best urban probability to be adopted by the RF results.
|**batch_spatialFilter.js**| Code with a set of functions and information to support the spatial filter..
|**spatial_filter.js**| Applies morphological operations to obtain the urban areas. Reference maps and the best probability thresholds are considered.
|**temporal_filter-1.js**| Applies temporal rules over pixels classified as urban areas from spatial filter results.
|**temporal_filter-2.js**| Applies temporal rules over pixels validated as urban areas from the first temporal filter.
|**temporal_filter-3.js**| Applies temporal rules over pixels not classified as urban areas until the second temporal filter.
|**temporal_filter-4.js**| Consolidates the results considering the previous processing steps.
<br/>

## Other information
The urban areas are classified according to land use and land cover samples assumed as reference. They are composed of randomly distributed points across the Brazilian territory and each one contains a database that includes a library of variables, such as spectral indexes and Landsat bands values about the class to which they belong. More information about how they are generated and validated can be found in the ATBD. The samples used in the classification are used in the **[classification_batch.js](classification_batch.js)** code.<br/>

The classification is based on polygons according to the International Millionth Map of the World over the interest territory. Also, hexagons where possible urban areas can be found were used to limit the territory to be classified. These areas combined were adopted as the processing unit and they are necessary to operate the classification within GEE memory limits. <br/>

# Start the classification process
## Start processing the classification_batch.js script
In this script, a classification process using Random Forest is carried out. All the codes in Table 1 are required. In it, the user must manually change the year variable to proceed with the classification. At the end of the basic classification process, an image by year (from 1985 to 2023) is formed and exported to the user asset into an image collection, which will be used in the next steps. The results by pixel (30 x 30 m) are presented in terms of probabilities to be urban. <br/>

Code: **[classification_batch.js](classification_batch.js)**

## Best threshold calculation
Since the image classified is expressed in terms of the probability to be urban, it is possible to select a value from which the classification is assumed as urban. This is processed by estimating the best probability to each polygon as defined previously considering probabilities from 25% to 75% (i. e. above 75% the map is assumed as urban). This product will be submitted to the spatial filter, when other reference maps will operate as boolean layers defining patches where urban areas can be found.<br/>

Code: **[best_thresholds.js](best_thresholds.js)**
## Start spatial filter
Spatial filters combine the information to improve the classification process considering the urban probability (from Random Forest classification and best thresholds);  the Index of Roads and Infrastructure (https://doi.org/10.1016/j.jag.2022.102791); monthly average radiance composite images using nighttime data from the Visible Infrared Imaging Radiometer Suite (VIIRS) Day/Night Band (DNB); Brazilian census tract (IBGE, 2020), and subnormal settlements (IBGE, 2010 and 2019).<br/>

Code: **[spatial_filter.js](spatial_filter.js)**

## Start temporal filter
The temporal filter (TF) consists of a method to improve classification consistency over the years. We developed a set of simple codes applied in a stepwise sense. Each of them operates according to the results obtained from the previous one. We encourage you to consider accessing the ATBD documentation to clarify the kernel concept adopted here. The main points of the code are explained in Table 3. <br/>

Both the input asset and the output asset (address where images must be exported) have to be set up into the heading lines of the codes. In general terms, the images from each step result are saved in an image collection named:

year + '-FT’ + n + ‘-’ + V,  <br/>
where FT = ‘temporal filter’, n = temporal filter order, and V = code version. <br/>

The same image collection is used to save all images from TF results. For each case, a list of years is considered as ‘initial years’, ‘mid years’ and ‘last years’. This segmentation is necessary to enable specific consistency rules. <br/>

_Table 3 - Temporal filters._ 
|Codes| Main points of the code|
|:---|:---|
|**[temporal_filter-1.js](temporal_filter-1.js)**| This filter (TF1) considers results from spatial filters. <br/> 
|**[temporal_filter-2.js](temporal_filter-2.js)**| This filter (TF2) considers results from TF1. <br/> 
|**[temporal_filter-3.js](temporal_filter-3.js)**| This filter (TF3) considers results from TF2. <br/> 
|**[temporal_filter-4.js](temporal_filter-4.js)**| This filter (TF4) considers results from TF3. <br/>

The final results from the last temporal filter acts by consolidanting urban areas in the context of the MapBiomas project. Any external comparison must consider the concepts expressed in the Urban Areas - Algorithm Theoretical Basis Document (ATBD), available in the **https://brasil.mapbiomas.org/**.
