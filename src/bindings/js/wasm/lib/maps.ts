
import { PrecisionSupportedType, JSArrayType } from 'openvinojs-common';
import { OVType, HEAPType } from './types';

export const ovTypesMap: { [Type in OVType]: PrecisionSupportedType } = {
  'uint8_t': 'uint8',
  'int8_t': 'int8',
  'uint16_t': 'uint16',
  'int16_t': 'int16',
  'uint32_t': 'uint32',
  'int32_t': 'int32',
  'float': 'float32',
  'double': 'float64',
};

// FIXME: define correct type
export const heapLabelByArrayTypeMap
: { [ArrayType in keyof JSArrayType as string]: HEAPType } = {
  Int8Array: 'HEAP8',
  Uint8Array: 'HEAPU8',
  // Uint8ClampedArray: 'HEAPU8',
  Int16Array: 'HEAP16',
  Uint16Array: 'HEAPU16',
  Int32Array: 'HEAP32',
  Uint32Array: 'HEAPU32',
  Float32Array: 'HEAPF32',
  Float64Array: 'HEAPF64',
};
