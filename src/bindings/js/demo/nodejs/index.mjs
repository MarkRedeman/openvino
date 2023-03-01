import { readFileSync } from 'node:fs';
import { createCanvas, loadImage } from 'canvas';

import ovWrapper from '../../common/ov_wrapper.mjs';
import openvinojs from '../dist/openvino_wasm.js';
import { getMaxElement } from '../dist/helpers.mjs';

import { default as imagenetClassesMap } from '../assets/imagenet_classes_map.mjs';

import Shape from '../../common/shape.mjs';
import Tensor from '../../common/tensor.mjs';

const MODEL_PATH = '../assets/models/';
const MODEL_NAME = 'v3-small_224_1.0_float';
const IMAGE_PATH = '../assets/images/coco224x224.jpg';

run();

async function run() {
  console.log('= Start');

  const ov = await ovWrapper.initialize(openvinojs);

  console.log(`== OpenVINO v${ov.getVersionString()}`);
  console.log(`== Description string: ${ov.getDescriptionString()}`);

  const xmlData = getFileDataAsArray(`${MODEL_PATH}${MODEL_NAME}.xml`);  
  const binData = getFileDataAsArray(`${MODEL_PATH}${MODEL_NAME}.bin`);  

  console.log('== before model loading');

  const shape = new Shape(1, 224, 224, 3);
  const model = await ov.loadModel(xmlData, binData, shape, 'NHWC');

  console.log('== after model loading');

  const img = await getImgByPath(IMAGE_PATH);
  const imgData = await getArrayByImg(img);
  const imgTensor = new Tensor('uint8', imgData, shape);

  const outputTensor = await model.infer(imgTensor);

  console.log('== Output tensor:');
  console.log(outputTensor.data);

  const max = getMaxElement(outputTensor.data);
  console.log(`== Max index: ${max.index}, value: ${max.value}`);
  console.log(`== Result class: ${imagenetClassesMap[max.index]}`);

  console.log('= End');
}

function getImgByPath(path) {
  return loadImage(path);
}

async function getArrayByImg(image) {
  const { width, height } = image;

  const canvas = createCanvas(width, width);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(image, 0, 0);
  const rgbaData = ctx.getImageData(0, 0, width, height).data;
  
  // Filter alpha channel
  return rgbaData.filter((_, index) => (index + 1)%4);
}

function getFileDataAsArray(path) {
  const fileData = readFileSync(path);

  return new Uint8Array(fileData);
}
