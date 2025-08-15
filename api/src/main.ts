import { createApp } from './app';

async function createAndRunApp() {
  await createApp();
}

void createAndRunApp();