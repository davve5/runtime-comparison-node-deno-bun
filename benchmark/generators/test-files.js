import fs from 'node:fs';
import fsPromises from 'node:fs/promises';

export const generateTestFiles = async () => {
  console.log('\n----- Generating test files -----');

  await generateLargeJson();
  await generateLargeBinaryFile();
};

const generateLargeJson = async () => {
  const filePath = 'large-data.json';
  const entries = 1000000;

  const writeStream = fs.createWriteStream(filePath);
  writeStream.write('{\n  "data": [\n');

  for (let i = 0; i < entries; i++) {
    const entry = {
      id: i,
      value: `Item ${i}`,
      timestamp: Date.now(),
      random: Math.random()
    };
    writeStream.write(i === 0 ? JSON.stringify(entry) : `,\n${JSON.stringify(entry)}`);
  }

  writeStream.write('\n  ]\n}');
  writeStream.end();

  await new Promise(resolve => writeStream.on('finish', resolve));
};

const generateLargeBinaryFile = async () => {
  const filePath = 'large-binary.dat';
  const fileSize = 100 * 1024 * 1024; // 100MB

  const buffer = Buffer.alloc(fileSize);
  for (let i = 0; i < fileSize; i++) {
    buffer[i] = Math.floor(Math.random() * 256);
  }
  await fsPromises.writeFile(filePath, buffer);
  console.log(`Generated ${filePath}`);
};