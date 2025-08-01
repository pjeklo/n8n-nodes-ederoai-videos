import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from "n8n-workflow";

export class GetTaskStatus implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Get Task Status",
    name: "getTaskStatus",
    group: ["transform"],
    version: 1,
    description: "Get the status of a video generation task",
    defaults: {
      name: "Get Task Status",
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: "edero-client-videos-Api",
        required: true,
      },
    ],
    properties: [
      {
        displayName: "Task ID",
        name: "taskId",
        type: "string",
        required: true,
        default: "",
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials("edero-client-videos-Api");
    const BASE_URL = "https://app.edero.ai/api/public";

    for (let i = 0; i < items.length; i++) {
      const taskId = this.getNodeParameter("taskId", i) as string;
      const response = await this.helpers.request({
        method: "GET",
        url: `${BASE_URL}/task/${taskId}`,
        headers: {
          Authorization: `Bearer ${credentials.apiKey}`,
        },
        json: true,
      });
      returnData.push({ json: response });
    }
    return [returnData];
  }
}
