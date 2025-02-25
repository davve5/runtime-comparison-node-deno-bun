const { runtime, fs, fsPromises, crypto } = require('../utils/runtime');

// Generate test data files
const generateTestFiles = async () => {
  console.log('\n----- Generating test files -----');

  await generateLargeJson();
  await generateLargeBinaryFile();
};

// Generate a large JSON file (100MB)
const generateLargeJson = async () => {
  const filePath = 'large-data.json';
  const entries = 1000000;

  // Stream-based approach for Node.js
  if (runtime === 'Node.js') {
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
  }
  // Deno approach
  else if (runtime === 'Deno') {
    const file = await Deno.open(filePath, { write: true, create: true, truncate: true });
    const encoder = new TextEncoder();

    await file.write(encoder.encode('{\n  "data": [\n'));

    for (let i = 0; i < entries; i++) {
      const entry = {
        id: i,
        value: `Item ${i}`,
        timestamp: Date.now(),
        random: Math.random()
      };
      const data = i === 0 ? JSON.stringify(entry) : `,\n${JSON.stringify(entry)}`;
      await file.write(encoder.encode(data));
    }

    await file.write(encoder.encode('\n  ]\n}'));
    file.close();
  }
  // Bun approach
  else if (runtime === 'Bun') {
    let content = '{\n  "data": [\n';

    for (let i = 0; i < entries; i++) {
      const entry = {
        id: i,
        value: `Item ${i}`,
        timestamp: Date.now(),
        random: Math.random()
      };
      content += i === 0 ? JSON.stringify(entry) : `,\n${JSON.stringify(entry)}`;

      // Write in chunks to avoid excessive memory usage
      if (i % 100000 === 0 && i > 0) {
        await Bun.write(filePath, content, { mode: i === 0 ? 'w' : 'a' });
        content = '';
      }
    }

    content += '\n  ]\n}';
    await Bun.write(filePath, content, { mode: 'a' });
  }

  console.log(`Generated ${filePath}`);
};

// Generate a large binary file (100MB)
const generateLargeBinaryFile = async () => {
  const filePath = 'large-binary.dat';
  const fileSize = 100 * 1024 * 1024; // 100MB

  if (runtime === 'Node.js') {
    const buffer = Buffer.alloc(fileSize);
    for (let i = 0; i < fileSize; i++) {
      buffer[i] = Math.floor(Math.random() * 256);
    }
    await fsPromises.writeFile(filePath, buffer);
  }
  else if (runtime === 'Deno') {
    const file = await Deno.open(filePath, { write: true, create: true, truncate: true });
    const buffer = new Uint8Array(fileSize);
    crypto.getRandomValues(buffer);
    await file.write(buffer);
    file.close();
  }
  else if (runtime === 'Bun') {
    const buffer = new Uint8Array(fileSize);
    crypto.getRandomValues(buffer);
    await Bun.write(filePath, buffer);
  }

  console.log(`Generated ${filePath}`);
};

module.exports = {
  generateTestFiles
};
