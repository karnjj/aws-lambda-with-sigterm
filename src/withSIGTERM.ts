import { ExtensionsClient } from './extensionsClient';

type Handler = () => void;

const initExtension = async () => {
  const endpoint = process.env.AWS_LAMBDA_RUNTIME_API;
  if (!endpoint) {
    console.warn('AWS_LAMBDA_RUNTIME_API is not set. Skipping Extension registration.');
    return;
  }

  const client = new ExtensionsClient(endpoint);
  const id = await client.register('NodeJSEnableSIGTERM');

  if (!id) {
    console.warn('Extension ID is not set. Skipping Extension registration.');
    return;
  }

  await client.nextEvent(id);
};

const onSIGTERM = async (...fn: Handler[]) => {
  try {
    process.on('SIGTERM', async () => {
      await Promise.all(fn.map((f) => f()));
      process.exit(0);
    });

    await initExtension();
  } catch (err) {
    console.warn('Failed to register Extension', err);
  }
};

const onceSIGTERM = async (...fn: Handler[]) => {
  try {
    process.once('SIGTERM', async () => {
      await Promise.all(fn.map((f) => f()));
      process.exit(0);
    });

    await initExtension();
  } catch (err) {
    console.warn('Failed to register Extension', err);
  }
};

export { onSIGTERM, onceSIGTERM };
