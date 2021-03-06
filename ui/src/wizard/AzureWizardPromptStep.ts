/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as types from '../../index';
import { IWizardNode } from './IWizardNode';

export abstract class AzureWizardPromptStep<T> implements types.AzureWizardPromptStep<T> {
    public hasSubWizard: boolean;
    public numSubPromptSteps: number;
    public wizardNode: IWizardNode<T>;
    public propertiesBeforePrompt: string[];
    public prompted: boolean;

    public abstract prompt(wizardContext: T): Promise<types.ISubWizardOptions<T> | void>;
    public abstract shouldPrompt(wizardContext: T): boolean;

    public reset(): void {
        this.hasSubWizard = false;
        this.numSubPromptSteps = 0;
        this.prompted = false;
    }
}
