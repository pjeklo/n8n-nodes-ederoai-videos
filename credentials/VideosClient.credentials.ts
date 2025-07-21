import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class EderoAiClientVideosApi implements ICredentialType {
	name = 'videos-client';
	displayName = 'Edero.ai Client | Videos API';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		}
	];
} 