import openvinoWASM from '../bin/openvino_wasm';
import { Tensor, Shape } from 'openvinojs-common';
import {
  getFileDataAsArray,
  uploadFile,
  convertShape,
  convertTensor,
  parseOriginalTensor,
} from './helpers';

import type { ITensor, IModel, IShape } from 'openvinojs-common';
import type {
  OpenvinoWASMModule,
  OriginalModel,
  OriginalTensor,
  OriginalTensorWrapper
} from './types';

const DEFAULT_PRECISION = 'uint8';

class WASMModel implements IModel {
  #ov: OpenvinoWASMModule;
  #originalModel: OriginalModel;

  constructor(ov: OpenvinoWASMModule, originalModel: OriginalModel) {
    this.#ov = ov;
    this.#originalModel = originalModel;
  }

  async infer(
    tensorOrDataArray: ITensor | number[],
    shape: IShape
  ): Promise<ITensor> {
    const tensor = tensorOrDataArray instanceof Tensor
      ? tensorOrDataArray
      : new Tensor(DEFAULT_PRECISION, tensorOrDataArray as number[], shape);

    const originalOutputTensor =
      await runInference(this.#ov, this.#originalModel, tensor);

    if (!originalOutputTensor) throw new Error('Error on model inference');

    return parseOriginalTensor(this.#ov, originalOutputTensor);
  }
}

export default async function loadModel(xmlPath: string, binPath: string,
  shapeData: Shape | number[], layout: string): Promise<IModel> {
  if (typeof xmlPath !== 'string' || typeof binPath !== 'string')
    throw new Error('Parameters \'xmlPath\' and \'binPath\' should be string');

  const ov: OpenvinoWASMModule = await openvinoWASM();

  const xmlData = await getFileDataAsArray(xmlPath);
  const binData = await getFileDataAsArray(binPath);

  const timestamp = Date.now();

  const xmlFilename = `m${timestamp}.xml`;
  const binFilename = `m${timestamp}.bin`;

  // Uploading and creating files on virtual WASM filesystem
  uploadFile(ov, xmlFilename, xmlData);
  uploadFile(ov, binFilename, binData);

  const shape = shapeData instanceof Shape
    ? shapeData
    : new Shape(...shapeData as number[]);
  const originalShape = convertShape(ov, shape);

  const originalModel = new ov.Session(xmlFilename, binFilename,
    originalShape.obj, layout);

  return new WASMModel(ov, originalModel);
}

export async function getVersionString(): Promise<string> {
  const ov = await openvinoWASM();

  return ov.getVersionString();
}

export async function getDescriptionString(): Promise<string> {
  const ov = await openvinoWASM();

  return ov.getDescriptionString();
}

function runInference(
  ov: OpenvinoWASMModule,
  model: OriginalModel,
  tensor: ITensor
): Promise<OriginalTensor | null> {
  let originalTensor: OriginalTensorWrapper;
  let originalOutputTensor: OriginalTensor;

  return new Promise((resolve, reject) => {
    try {
      console.time('== Inference time');
      originalTensor = convertTensor(ov, tensor);
      originalOutputTensor = model.infer(originalTensor.obj);
      console.timeEnd('== Inference time');
    } catch(e) {
      reject(e);
    } finally {
      originalTensor.free();
    }

    resolve(originalOutputTensor);
  });
}
