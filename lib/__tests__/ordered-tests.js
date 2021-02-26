const fs = require('fs');
const jsonfile = require('jsonfile');

const deleteFile = require('../utils/utils');
const compile = require('../compile');
const setup = require('../setup');
const computeWitness = require('../compute-witness');
const generateProof = require('../generate-proof');
const extractVk = require('../extract-vk');
const verify = require('../verify');

describe('Compile tests', () => {
  it('should throw an error if file path does not exists', async () => {
    expect.assertions(1);
    await expect(compile('./foo', './code/test/', 'test-compiled')).rejects.toThrow(Error);
  });

  it('should throw an error if file type is incorrect', async () => {
    expect.assertions(1);
    await expect(compile('./code/test', './code/test/', 'test-compiled')).rejects.toThrow(Error);
  });

  it('should create the given output file', async () => {
    await compile('./code/test.zok', './code/test/', 'test-compiled', 'bls12_377');
    expect(fs.existsSync('./code/test/test-compiled')).toBe(true);
    deleteFile('./code/test/test-compiled');
  });

  it('should return a string given a verbose flag', async () => {
    const output = await compile('./code/test.zok', './code/test/', 'test-compiled', 'bls12_377', {
      verbose: true,
    });
    expect(typeof output).toBe('string');
  });
});
describe('Setup tests', () => {
  it('should throw an error if file path does not exists', async () => {
    expect.assertions(1);
    await expect(
      setup('./foo', './code/test/', 'gm17', 'ark', 'test-vk', 'test-pk'),
    ).rejects.toThrow(Error);
  });

  it('should throw an error if input file ends with .zok', async () => {
    expect.assertions(1);
    await expect(
      setup('./code/test/test-compiled.zok', './code/test/', 'gm17', 'ark', 'test-vk', 'test-pk'),
    ).rejects.toThrow(Error);
  });

  it('should create the given output file with default names', async () => {
    expect.assertions(2);
    await setup('./code/test/test-compiled', './code/test/', 'gm17', 'ark', undefined, undefined);
    expect(fs.existsSync('./code/test/verification.key')).toBe(true);
    expect(fs.existsSync('./code/test/proving.key')).toBe(true);
    deleteFile('./code/test/verification.key');
    deleteFile('./code/test/proving.key');
  });

  it('should allow GM17 proving scheme with ark backend', async () => {
    expect.assertions(1);
    const basePath = './code/test/';
    const vkPath = `${basePath}test-vk.key`;
    const pkPath = `${basePath}test-pk.key`;

    // eslint-disable-next-line no-await-in-loop
    await setup('./code/test/test-compiled', './code/test/', 'gm17', 'ark', 'test-vk', 'test-pk');
    expect(fs.existsSync(vkPath) && fs.existsSync(pkPath)).toBe(true);
    deleteFile('./code/test/test-vk.key');
    deleteFile('./code/test/test-pk.key');
  });

  it('should return a string given a verbose flag', async () => {
    const output = await setup(
      './code/test/test-compiled',
      './code/test/',
      'gm17',
      'ark',
      'test-vk',
      'test-pk',
      {
        verbose: true,
      },
    );
    expect(typeof output).toBe('string');
  });
});
describe('verifier key extraction tests', () => {
  it('should return a json version of the verifier key', async () => {
    expect.assertions(7);
    const vk = extractVk('./code/test/test-vk.key');
    expect(Object.keys(vk)).toEqual(['h', 'g_alpha', 'h_beta', 'g_gamma', 'h_gamma', 'query']);
    expect(vk.h).toEqual(expect.anything());
    expect(vk.g_alpha).toEqual(expect.anything());
    expect(vk.h_beta).toEqual(expect.anything());
    expect(vk.g_gamma).toEqual(expect.anything());
    expect(vk.h_gamma).toEqual(expect.anything());
    expect(vk.query).toEqual(expect.anything());
  });
  it('should handle unknown vk filenames gracefully', async () => {
    const vk = extractVk('./code/test/non-existent-filename.key');
    expect(vk).toEqual(null);
  });
});
describe('Compute witness tests', () => {
  it('should throw an error if file path does not exists', async () => {
    expect.assertions(1);
    await expect(computeWitness('./foo', './code/test', 'test-witness', [5, 25])).rejects.toThrow(
      Error,
    );
  });

  it('should throw an error if input file ends with .zok', async () => {
    expect.assertions(1);
    await expect(
      computeWitness('./code/test/test-compiled.zok', './code/test/', 'test-witness', [5, 25]),
    ).rejects.toThrow(Error);
  });

  it('should create the given output file', async () => {
    await computeWitness('./code/test/test-compiled', './code/test/', 'test-witness', [5, 25]);
    expect(fs.existsSync('./code/test/test-witness')).toBe(true);
    deleteFile('./code/test/test-witness');
  });

  it('should create a file called "witness" if no argument is given in outputName', async () => {
    await computeWitness('./code/test/test-compiled', './code/test/', undefined, [5, 25]);
    expect(fs.existsSync('./code/test/witness')).toBe(true);
    deleteFile('./code/test/witness');
  });

  it('should return a string given a verbose flag', async () => {
    const output = await computeWitness(
      './code/test/test-compiled',
      './code/test/',
      'test-witness',
      [5, 25],
      {
        verbose: true,
      },
    );
    expect(typeof output).toBe('string');
  });
});
describe('Generate proof tests', () => {
  it('should throw an error if code path or proving key path does not exists', async () => {
    expect.assertions(2);
    await expect(
      generateProof(
        './foo',
        './code/test/test-compiled',
        './code/test/test-witness',
        'gm17',
        'ark',
        {
          createFile: true,
          directory: './code/',
          fileName: 'test-proof.json',
        },
      ),
    ).rejects.toThrow(Error);

    await expect(
      generateProof('./code/test/test-pk.key', './foo', './code/test/test-witness', 'gm17', 'ark', {
        createFile: true,
        directory: './code/',
        fileName: 'test-proof.json',
      }),
    ).rejects.toThrow(Error);
  });

  it('should throw an error if code path ends with ".zok"', async () => {
    expect.assertions(1);
    await expect(
      generateProof(
        './code/test/test-pk.key',
        './code/test/test-compiled.zok',
        './code/test/test-witness',
        'gm17',
        {
          createFile: true,
          directory: './code/test/',
          fileName: 'test-proof.json',
        },
      ),
    ).rejects.toThrow(Error);
  });

  it('should create the given output file', async () => {
    await generateProof(
      './code/test/test-pk.key',
      './code/test/test-compiled',
      './code/test/test-witness',
      'gm17',
      'ark',
      {
        createFile: true,
        directory: './code/test/',
        fileName: 'test-proof.json',
      },
    );
    expect(fs.existsSync('./code/test/test-proof.json')).toBe(true);
  });

  it('should create a file named "proof.json" if no output file specified', async () => {
    await generateProof(
      './code/test/test-pk.key',
      './code/test/test-compiled',
      './code/test/test-witness',
      'gm17',
      'ark',
      {
        createFile: true,
        directory: './code/test/',
        fileName: undefined,
      },
    );
    expect(fs.existsSync('./code/test/proof.json')).toBe(true);
    deleteFile('./code/test/proof.json');
  });
});
describe('Verification tests', () => {
  it('Should verify true, when the proof and verifier are correct', async () => {
    // get data from existing files to act as inputs for the call
    const [proof, vk] = await Promise.all([
      jsonfile.readFile('./code/test/test-proof.json'),
      jsonfile.readFile('./code/test/test-vk.key'),
    ]);
    const response = await verify(vk, proof, 'gm17', 'ark', 'bls12_377');
    expect(response).toBe(true);
  });
});
