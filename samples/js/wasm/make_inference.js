async function makeInference({ modelPath, imgPath, shape, layout }, events = {}) {
  const ov = await openvino.init(); 
  const { Tensor, loadModel } = ov; 

  events.onLibInitializing = events.onLibInitializing || (() => {});
  events.onModelLoaging = events.onModelLoaging || (() => {});
  events.onInferenceRunning = events.onInferenceRunning || (() => {});
  events.onFinish = events.onFinish || (() => {});

  console.log('= Start');

  events.onLibInitializing();

  console.log(`== OpenVINO v${ov.getVersionString()}`);
  console.log(`== Description string: ${ov.getDescriptionString()}`);

  events.onModelLoaging(ov);
  const model = await loadModel(modelPath.xml, modelPath.bin, shape, layout);

  events.onInferenceRunning(model);
  const inputTensor = await getArrayByImgPath(imgPath);

  const outputTensor = await model.infer(inputTensor, shape);

  events.onFinish(outputTensor);
  const max = getMaxElement(outputTensor.data);
  console.log(`== Max index: ${max.index}, value: ${max.value}`);

  const imagenetClassesMap = await fetch('./assets/imagenet_classes_map.json')
    .then((response) => response.json());

  console.log(`== Result class: ${imagenetClassesMap[max.index]}`);

  console.log('= End');
}

function getMaxElement(arr) {
  if (!arr.length) return { value: -Infinity, index: -1 };

  let max = arr[0];
  let maxIndex = 0;

  for (let i = 1; i < arr.length; ++i) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return { value: max, index: maxIndex };
}

async function getArrayByImgPath(path) {
  const image = await loadImage(path);
  const { width, height } = image;

  const canvas = createCanvas(width, width);
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Canvas context is null');

  ctx.drawImage(image, 0, 0);
  const rgbaData = ctx.getImageData(0, 0, width, height).data;
  
  return rgbaData.filter((_, index) => (index + 1)%4);
}

function loadImage(path) {
  return new Promise((resolve) => {
    const img = new Image();

    img.src = path;
    img.onload = () => {
      resolve(img);
    };
  });
}

function createCanvas(width, height) {
  const canvasElement = document.createElement('canvas');

  canvasElement.width = width;
  canvasElement.height = height;

  return canvasElement;
}
