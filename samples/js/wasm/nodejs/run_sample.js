const openvinojs = require('openvinojs-wasm');

const DEFAULT_SAMPLE = 'classification';
const sample = process.env['sample'] || DEFAULT_SAMPLE;

run(sample);

async function run(sample) {
  const sampleFilename = `./samples/${sample}.mjs`;

  console.log(`= Run sample: ${sampleFilename}`);

  const { default: runSample } = await import(sampleFilename);

  await runSample(openvinojs);

  console.log('= End');
}
