/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { HttpOperationResponse } from 'ms-rest';
import { Readable } from 'stream';
import { SiteClient } from './SiteClient';

/**
 * Overwrites or creates a file. The etag passed in may be `undefined` if the file is being created
 * Returns the latest etag of the updated file
 */
export async function putFile(client: SiteClient, data: Readable | string, filePath: string, etag: string | undefined): Promise<string> {
    let stream: Readable;
    if (typeof data === 'string') {
        stream = new Readable();
        stream._read = function (this: Readable): void {
            this.push(data);
            this.push(null);
        };
    } else {
        stream = data;
    }
    const options: {} = etag ? { customHeaders: { ['If-Match']: etag } } : {};
    const result: HttpOperationResponse<{}> = await client.kudu.vfs.putItemWithHttpOperationResponse(stream, filePath, options);
    return <string>result.response.headers.etag;
}
