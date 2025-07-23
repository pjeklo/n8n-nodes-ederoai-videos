import { ICredentialType, INodeProperties } from "n8n-workflow";

export class EderoAiClientVideosApi implements ICredentialType {
  name = 'edero-client-videos-Api';
  displayName = "Edero.ai Client | Videos API";
  documentationUrl = 'https://app.edero.ai/docs';
  properties: INodeProperties[] = [
    {
      displayName: "API Key",
      name: "apiKey",
      type: "string",
      typeOptions: { password: true },
      default: "",
    },
  ];
}
