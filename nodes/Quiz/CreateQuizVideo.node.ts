import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from "n8n-workflow";

export class CreateQuizVideo implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Create Quiz Video",
    name: "createQuizVideo",
    group: ["transform"],
    version: 1,
    description: "Generate a quiz video",
    defaults: {
      name: "Create Quiz Video",
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
        displayName: "Video Name",
        name: "name",
        type: "string",
        description:
          "A descriptive name for your quiz video (e.g., 'Math Quiz', 'History Trivia', 'Science Test')",
        required: true,
        default: "",
        typeOptions: { minValue: 1, maxLength: 255 },
      },
      {
        displayName: "Video Template",
        name: "template",
        type: "options",
        description:
          "Video template style for quiz presentation (currently only Quiz is supported)",
        default: "Quiz",
        options: [{ name: "Quiz", value: "Quiz" }],
      },
      {
        displayName: "Quiz Questions",
        name: "questions",
        type: "fixedCollection",
        description:
          "Array of quiz questions with their answers. Each question can have multiple answer options.",
        required: true,
        default: {},
        options: [
          {
            name: "question",
            displayName: "Question",
            values: [
              {
                displayName: "Question Text",
                name: "text",
                type: "string",
                required: true,
                default: "",
                description:
                  "The question text to display (e.g., 'What is the capital of France?')",
                typeOptions: { minValue: 1, maxLength: 500 },
              },
              {
                displayName: "Answer Options",
                name: "answers",
                type: "fixedCollection",
                description:
                  "Array of possible answers for this question. Include the correct answer and distractors.",
                required: true,
                default: {},
                options: [
                  {
                    name: "answer",
                    displayName: "Answer",
                    values: [
                      {
                        displayName: "Answer Text",
                        name: "text",
                        type: "string",
                        required: true,
                        default: "",
                        description:
                          "The answer text to display (e.g., 'Paris', 'London', 'Berlin')",
                        typeOptions: { minValue: 1, maxLength: 200 },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        displayName: "Voice Configuration",
        name: "voiceSettings",
        type: "collection",
        description:
          "Configure the voice settings for text-to-speech generation of quiz questions and answers",
        required: true,
        default: {},
        options: [
          {
            displayName: "ElevenLabs Voice ID",
            name: "voiceId",
            type: "options",
            default: "21m00Tcm4TlvDq8ikWAM",
            description:
              "ElevenLabs voice ID for text-to-speech. Choose from available voices in your account.",
            options: [{ name: "Default Voice", value: "21m00Tcm4TlvDq8ikWAM" }],
          },
          {
            displayName: "Voice Stability",
            name: "stability",
            type: "number",
            default: 0.4,
            description: 'Voice stability setting (0.0-1.0). Higher values = more stable but less expressive voice.',
            typeOptions: { minValue: 0, maxValue: 1 },
          },
          {
            displayName: "Similarity Boost",
            name: "similarityBoost",
            type: "number",
            default: 0.45,
            description: 'Voice similarity boost (0.0-1.0). Higher values = more similar to original voice.',
            typeOptions: { minValue: 0, maxValue: 1 },
          },
          {
            displayName: "Style Exaggeration",
            name: "styleExaggeration",
            type: "number",
            default: 0.5,
            description: 'Style exaggeration setting (0.0-1.0). Higher values = more dramatic style.',
            typeOptions: { minValue: 0, maxValue: 1 },
          },
        ],
      },
      {
        displayName: "Answer Template",
        name: "answerTemplate",
        type: "string",
        description:
          "Template for answer display. Use {{answer}} placeholder to show the selected answer.",
        default: "",
        typeOptions: { maxLength: 500 },
      },
      {
        displayName: "Theme",
        name: "theme",
        type: "options",
        description: "Visual theme for the quiz video interface",
        default: "light",
        options: [
          { name: "Light Theme", value: "light" },
          { name: "Dark Theme", value: "dark" },
        ],
      },
      {
        displayName: 'Question Display Time (Seconds)',
        name: "questionDisplayTime",
        type: "number",
        description:
          "How long to display each question before showing the answer (1-60 seconds)",
        default: 5,
        typeOptions: { minValue: 1, maxValue: 60 },
      },
      {
        displayName: 'Answer Display Time (Seconds)',
        name: "answerDisplayTime",
        type: "number",
        description: "How long to display each answer (1-30 seconds)",
        default: 3,
        typeOptions: { minValue: 1, maxValue: 30 },
      },
      {
        displayName: "Show Correct Answers",
        name: "showCorrectAnswers",
        type: "boolean",
        description: "Whether to highlight correct answers in the video",
        default: true,
      },
      {
        displayName: "Background Configuration",
        name: "backgroundSettings",
        type: "collection",
        description:
          "Configure the video background (optional - uses default if not specified)",
        default: {},
        options: [
          {
            displayName: "Background Generation Prompt",
            name: "backgroundPrompt",
            type: "string",
            default: "",
            description:
              "Prompt for AI background generation. Used when background type is 'generated'. Describe the background you want AI to create.",
            typeOptions: { minValue: 5, maxValue: 500 },
          },
          {
            displayName: "Background Type",
            name: "type",
            type: "options",
            default: "default",
            description:
              "Type of background to use for the video. Choose from predefined backgrounds, custom uploads, or AI-generated backgrounds.",
            options: [
              { name: "AI Generated Background", value: "generated" },
              { name: "Custom Background", value: "custom" },
              { name: "Default Background", value: "default" },
              { name: "Preset Background", value: "preset" },
              { name: "Upload Background", value: "upload" },
            ],
          },
          {
            displayName: "Custom Prompt",
            name: "customPrompt",
            type: "string",
            default: "",
            description:
              "Used when background type is 'custom'. Describe the background you want to generate.",
            typeOptions: { maxLength: 200 },
          },
          {
            displayName: "Selected Background ID",
            name: "selectedBackgroundId",
            type: "string",
            default: "",
            description:
              "ID of pre-selected background from the preset library. Used when background type is 'preset'.",
            typeOptions: { maxLength: 100 },
          },
          {
            displayName: "Upload Background File",
            name: "uploadedFile",
            type: "string",
            default: "",
            description:
              "Upload background image file. Used when background type is 'upload'.",
          },
          {
            displayName: "Uploaded File URL",
            name: "uploadedFileUrl",
            type: "string",
            default: "",
            description:
              "URL of uploaded background image. Used when background type is 'upload'.",
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials("edero-client-videos-Api");
    const BASE_URL = "https://app.edero.ai/api/public";

    for (let i = 0; i < items.length; i++) {
      // You would need to transform the n8n parameters into the correct API body here
      const body = this.getNodeParameter("name", i);
      // ... build the body from all parameters ...
      const response = await this.helpers.request({
        method: "POST" as const,
        url: `${BASE_URL}/quiz`,
        headers: {
          Authorization: `Bearer ${credentials.apiKey}`,
          "Content-Type": "application/json",
        },
        body,
        json: true,
      });
      returnData.push({ json: response });
    }
    return [returnData];
  }
}
