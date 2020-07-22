const fs = require('fs');
const deleteFile = require('../utils/utils');

const compile = require('../compile');
const setup = require('../setup');
const computeWitness = require('../compute-witness');
const generateProof = require('../generate-proof');

describe('Compilation tests', () => {
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
      setup('./foo', './code/test/', 'gm17', 'zexe', 'test-vk', 'test-pk'),
    ).rejects.toThrow(Error);
  });

  it('should throw an error if input file ends with .zok', async () => {
    expect.assertions(1);
    await expect(
      setup('./code/test/test-compiled.zok', './code/test/', 'gm17', 'zexe', 'test-vk', 'test-pk'),
    ).rejects.toThrow(Error);
  });

  it('should create the given output file with default names', async () => {
    expect.assertions(2);
    await setup('./code/test/test-compiled', './code/test/', 'gm17', 'zexe', undefined, undefined);
    expect(fs.existsSync('./code/test/verification.key')).toBe(true);
    expect(fs.existsSync('./code/test/proving.key')).toBe(true);
    deleteFile('./code/test/verification.key');
    deleteFile('./code/test/proving.key');
  });

  it('should allow GM17 proving scheme with Zexe backend', async () => {
    expect.assertions(1);
    const basePath = './code/test/';
    const vkPath = `${basePath}test-vk.key`;
    const pkPath = `${basePath}test-pk.key`;

    // eslint-disable-next-line no-await-in-loop
    await setup('./code/test/test-compiled', './code/test/', 'gm17', 'zexe', 'test-vk', 'test-pk');
    expect(fs.existsSync(vkPath) && fs.existsSync(pkPath)).toBe(true);
    deleteFile('./code/test/test-vk.key');
    deleteFile('./code/test/test-pk.key');
  });

  it('should return a string given a verbose flag', async () => {
    const output = await setup(
      './code/test/test-compiled',
      './code/test/',
      'gm17',
      'zexe',
      'test-vk',
      'test-pk',
      {
        verbose: true,
      },
    );
    expect(typeof output).toBe('string');
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
        'zexe',
        {
          createFile: true,
          directory: './code/',
          fileName: 'test-proof.json',
        },
      ),
    ).rejects.toThrow(Error);

    await expect(
      generateProof(
        './code/test/test-pk.key',
        './foo',
        './code/test/test-witness',
        'gm17',
        'zexe',
        {
          createFile: true,
          directory: './code/',
          fileName: 'test-proof.json',
        },
      ),
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
      'zexe',
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
      'zexe',
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
