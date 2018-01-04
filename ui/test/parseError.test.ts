/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { IParsedError } from '../index';
import { UserCancelledError } from '../src/errors';
import { parseError } from '../src/parseError';

suite('Error Parsing Tests', () => {
    test('Generic Error', () => {
        const pe: IParsedError = parseError(new Error('test'));
        assert.equal(pe.errorType, 'Error');
        assert.equal(pe.message, 'test');
        assert.equal(pe.isUserCancelledError, false);
    });

    test('Specific Error', () => {
        const pe: IParsedError = parseError(new ReferenceError('test'));
        assert.equal(pe.errorType, 'ReferenceError');
        assert.equal(pe.message, 'test');
        assert.equal(pe.isUserCancelledError, false);
    });

    test('UserCancelledError', () => {
        const pe: IParsedError = parseError(new UserCancelledError());
        assert.equal(pe.errorType, 'UserCancelledError');
        assert.equal(pe.message, 'Operation cancelled.');
        assert.equal(pe.isUserCancelledError, true);
    });

    test('Azure Error', () => {
        const pe: IParsedError = parseError(new Error('{ "Code": "Conflict", "Message": "test" }'));
        assert.equal(pe.errorType, 'Conflict');
        assert.equal(pe.message, 'test');
        assert.equal(pe.isUserCancelledError, false);
    });

    test('String', () => {
        const pe: IParsedError = parseError('test');
        assert.equal(pe.errorType, 'string');
        assert.equal(pe.message, 'test');
        assert.equal(pe.isUserCancelledError, false);
    });

    test('Empty String', () => {
        const pe: IParsedError = parseError('   ');
        assert.equal(pe.errorType, 'string');
        assert.equal(pe.message, 'Unknown Error');
        assert.equal(pe.isUserCancelledError, false);
    });

    test('Object', () => {
        const pe: IParsedError = parseError({ errorCode: 1 });
        assert.equal(pe.errorType, 'Object');
        assert.equal(pe.message, '{"errorCode":1}');
        assert.equal(pe.isUserCancelledError, false);
    });

    test('Custom Object', () => {
        class MyObject {
            public readonly msg: string;
            constructor(msg: string) { this.msg = msg; }
        }

        const pe: IParsedError = parseError(new MyObject('test'));
        assert.equal(pe.errorType, 'MyObject');
        assert.equal(pe.message, '{"msg":"test"}');
        assert.equal(pe.isUserCancelledError, false);
    });

    test('Null', () => {
        const pe: IParsedError = parseError(null);
        assert.equal(pe.errorType, 'object');
        assert.equal(pe.message, 'Unknown Error');
        assert.equal(pe.isUserCancelledError, false);
    });

    test('Array', () => {
        const pe: IParsedError = parseError([1, 2]);
        assert.equal(pe.errorType, 'Array');
        assert.equal(pe.message, '[1,2]');
        assert.equal(pe.isUserCancelledError, false);
    });

    test('Number', () => {
        const pe: IParsedError = parseError(3);
        assert.equal(pe.errorType, 'number');
        assert.equal(pe.message, '3');
        assert.equal(pe.isUserCancelledError, false);
    });

    test('Boolean', () => {
        const pe: IParsedError = parseError(false);
        assert.equal(pe.errorType, 'boolean');
        assert.equal(pe.message, 'false');
        assert.equal(pe.isUserCancelledError, false);
    });

    test('Undefined', () => {
        const pe: IParsedError = parseError(undefined);
        assert.equal(pe.errorType, 'undefined');
        assert.equal(pe.message, 'Unknown Error');
        assert.equal(pe.isUserCancelledError, false);
    });
});