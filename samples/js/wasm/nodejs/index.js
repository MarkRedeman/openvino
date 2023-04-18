const makeInference = require('../make_inference.js');

const inferenceParametersFaceDetection = { 
  modelPath: getModelPaths('v3-small_224_1.0_float'),
  imgPath: '../../assets/images/coco224x224.jpg',
  shape: [1, 224, 224, 3],
  layout: 'NHWC',
};

makeInference(inferenceParametersFaceDetection);

function getModelPaths(name) {
  const MODEL_PATH = '../../assets/models/';
  const pathAndName = `${MODEL_PATH}${name}`;

  return {
    xml: `${pathAndName}.xml`,
    bin: `${pathAndName}.bin`,
  };
}
