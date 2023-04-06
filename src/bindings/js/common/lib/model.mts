import { OpenvinoModule, OriginalModel } from './ov-module.mjs';
import Tensor from './tensor.mjs';

import type { ITensor, IModel, IShape } from './types.mjs';

export default class Model implements IModel {
  #ov: OpenvinoModule;
  #originalModel: OriginalModel;

  constructor(ov: OpenvinoModule, originalModel: OriginalModel) {
    this.#ov = ov;
    this.#originalModel = originalModel;
  }

  infer(tensorOrDataArray: ITensor | number[], shape: IShape): Promise<ITensor> {
    const tensor = tensorOrDataArray instanceof Tensor 
      ? tensorOrDataArray 
      : new Tensor('uint8', tensorOrDataArray as number[], shape);

    const wrapper = new Promise<ITensor>((resolve, reject) => {
      let outputTensor: ITensor | null;
      
      try {
        outputTensor = runInference(this.#ov, this.#originalModel, tensor);
      } catch(e) {
        return reject(e);
      }

      outputTensor ? resolve(outputTensor) : reject(null);
    });

    return wrapper;
  }
}

function runInference(ov: OpenvinoModule, model: OriginalModel, tensor: ITensor): ITensor | null {
  let originalTensor;
  let originalOutputTensor; 

  try {
    console.time('== Inference time');
    originalTensor = tensor.convert(ov);
    originalOutputTensor = model.infer(originalTensor.obj);
    console.timeEnd('== Inference time');
  } finally {
    if (originalTensor) originalTensor.free();
  }

  return originalOutputTensor ? Tensor.parse(ov, originalOutputTensor) : null;
}
