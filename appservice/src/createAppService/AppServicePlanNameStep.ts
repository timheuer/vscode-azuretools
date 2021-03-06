/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureWizardPromptStep, IAzureNamingRules } from 'vscode-azureextensionui';
import { ext } from '../extensionVariables';
import { localize } from '../localize';
import { nonNullProp } from '../utils/nonNull';
import { AppServicePlanListStep } from './AppServicePlanListStep';
import { IAppServiceWizardContext } from './IAppServiceWizardContext';

export const appServicePlanNamingRules: IAzureNamingRules = {
    minLength: 1,
    maxLength: 40,
    invalidCharsRegExp: /[^a-zA-Z0-9\-]/
};

export class AppServicePlanNameStep extends AzureWizardPromptStep<IAppServiceWizardContext> {
    public async prompt(wizardContext: IAppServiceWizardContext): Promise<void> {
        if (!wizardContext.newPlanName) {
            wizardContext.newPlanName = (await ext.ui.showInputBox({
                value: await wizardContext.relatedNameTask,
                prompt: localize('AppServicePlanPrompt', 'Enter the name of the new App Service plan.'),
                validateInput: async (value: string): Promise<string | undefined> => await this.validatePlanName(wizardContext, value)
            })).trim();
        }
    }

    public shouldPrompt(wizardContext: IAppServiceWizardContext): boolean {
        return !wizardContext.newPlanName;
    }

    private async validatePlanName(wizardContext: IAppServiceWizardContext, name: string | undefined): Promise<string | undefined> {
        name = name ? name.trim() : '';

        if (name.length < appServicePlanNamingRules.minLength || name.length > appServicePlanNamingRules.maxLength) {
            return localize('invalidLength', 'The name must be between {0} and {1} characters.', appServicePlanNamingRules.minLength, appServicePlanNamingRules.maxLength);
        } else if (name.match(appServicePlanNamingRules.invalidCharsRegExp)) {
            return localize('invalidChars', "The name can only contain alphanumeric characters and hyphens.");
        } else if (wizardContext.resourceGroup && !await AppServicePlanListStep.isNameAvailable(wizardContext, name, nonNullProp(wizardContext.resourceGroup, 'name'))) {
            return localize('nameAlreadyExists', 'App Service plan "{0}" already exists in resource group "{1}".', name, wizardContext.resourceGroup.name);
        } else {
            return undefined;
        }
    }
}
