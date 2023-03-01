export const ovTypesMap = {
  'uint8_t': 'uint8',
  'int8_t': 'int8',
  'uint16_t': 'uint16',
  'int16_t': 'int16',
  'uint32_t': 'uint32',
  'int32_t': 'int32',

  'float': 'float32',
  'double': 'float64',

  'uint64_t': 'uint64',
  'int64_t': 'int64',
};

export const jsTypeByPrecisionMap = {
  int8: Int8Array,
  uint8: Uint8Array,
  uint8c: Uint8ClampedArray,
  int16: Int16Array,
  uint16: Uint16Array,
  int32: Int32Array,
  uint32: Uint32Array,

  float32: Float32Array,
  float64: Float64Array,

  int64: BigInt64Array,
  uint64: BigUint64Array,
};

export const heapLabelByTypeMap = {
  Int8Array: 'HEAP8',
  Uint8Array: 'HEAPU8',
  Uint8ClampedArray: 'HEAPU8',
  Int16Array: 'HEAP16',
  Uint16Array: 'HEAPU16',
  Int32Array: 'HEAP32',
  Uint32Array: 'HEAPU32',

  Float32Array: 'HEAPF32',
  Float64Array: 'HEAPF64',
}
