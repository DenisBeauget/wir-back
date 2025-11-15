import { buildApp } from './app.js';

const start = async () => {
  const app = await buildApp();
  try {
    await app.listen({ port: 8081, host: '0.0.0.0' });
    console.log(`What i read server ready at http://localhost:8081`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
