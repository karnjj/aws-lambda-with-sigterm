import fetch from 'node-fetch';

const LAMBDA_EXTENSION_VERSION = '2020-01-01';
const LAMBDA_EXTENSION_NAME = 'Lambda-Extension-Name';
const LAMBDA_EXTENSION_IDENTIFIER = 'Lambda-Extension-Identifier';

export class ExtensionsClient {
  private baseUrl: string;
  private extensionId: string | undefined;

  constructor(address: string) {
    this.baseUrl = `http://${address}/${LAMBDA_EXTENSION_VERSION}/extension`;
  }

  public getExtensionId() {
    return this.extensionId;
  }

  public async register(name: string, events?: string[]) {
    const url = `${this.baseUrl}/register`;
    const headers = {
      [LAMBDA_EXTENSION_NAME]: name,
    };
    const body = {
      events: events,
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    });

    if (res.status !== 200) {
      throw new Error(`Failed to register extension: ${res.status}`);
    }

    this.extensionId = res.headers[LAMBDA_EXTENSION_IDENTIFIER];

    return this.extensionId;
  }

  public async nextEvent(id?: string) {
    const url = `${this.baseUrl}/event/next`;

    if (!id && !this.extensionId) {
      throw new Error('Extension ID is not set');
    }

    const headers = {
      [LAMBDA_EXTENSION_IDENTIFIER]: id || (this.extensionId as string),
    };

    const res = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (res.status !== 200) {
      throw new Error(`Failed to get next event: ${res.status}`);
    }
  }
}
