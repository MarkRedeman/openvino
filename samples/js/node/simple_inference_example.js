const { addon } = require('openvinojs-node');

const math = require('./lib/helpers.js');
const cv = require('opencv.js');
const imagenetClassesMap = require('../assets/imagenet_classes_map.json');
const Jimp = require('jimp');

run();

async function run()
{

  /*   ---Load an image---   */
  //read image from a file
  const imgPath = process.argv[2] || '../assets/images/shih_tzu.jpg';
  const jimpSrc = await Jimp.read(imgPath);
  const src = cv.matFromImageData(jimpSrc.bitmap);
  cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);
  cv.resize(src, src, new cv.Size(224, 224));
  //create tensor
  const tensorData = new Float32Array(src.data);
  const tensor = new addon.Tensor(
    addon.element.f32,
    Int32Array.from([1, 224, 224, 3]),
    tensorData,
  );

  /*   ---Load and compile the model---   */
  const modelPath = '../assets/models/v3-small_224_1.0_float.xml';
  const model = new addon.Model().read_model(modelPath).compile('CPU');

  /*   ---Perform inference---   */
  const output = model.infer(tensor);

  //show the results
  console.log('Result: ' + imagenetClassesMap[math.argMax(output.data)]);
  console.log(math.argMax(output.data));
}
