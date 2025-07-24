import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from "n8n-workflow";

export class CreateFakeTextVideo implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Create Fake Text Video",
    name: "createFakeTextVideo",
    group: ["transform"],
    version: 1,
    description: "Generate a fake text conversation video",
    defaults: {
      name: "Create Fake Text Video",
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
          "A descriptive name for your fake text conversation video (e.g., 'Dating App Chat', 'Business Negotiation', 'Friend Drama')",
        required: true,
        default: "",
        typeOptions: {
          minValue: 1,
          maxLength: 255,
        },
      },
      {
        displayName: "Message Template",
        name: "template",
        type: "options",
        description:
          "Choose the messaging platform style for your conversation",
        required: true,
        default: "iMessage",
        options: [
          { name: "iMessage", value: "iMessage" },
          { name: "WhatsApp", value: "whatsapp" },
          { name: "Instagram", value: "instagram" },
          { name: "Tinder", value: "tinder" },
        ],
      },
      {
        displayName: "Messages",
        name: "messages",
        type: "fixedCollection",
        description:
          "Array of messages in the conversation. Each message can be text or media (photos/videos).",
        required: true,
        default: {},
        options: [
          {
            name: "message",
            displayName: "Message",
            values: [
											{
												displayName: 'Content Type',
												name: 'contentType',
												type: 'string',
												default: '',
												description: 'MIME type for media messages (e.g., image/jpeg, video/mp4)',
											},
											{
												displayName: 'Media Height',
												name: 'height',
												type: 'number',
												default: 0,
												description: 'Height of the media in pixels',
											},
											{
												displayName: 'Media URL',
												name: 'photoUrl',
												type: 'string',
												default: '',
												description: 'URL of the media file (for photo/video messages)',
											},
											{
												displayName: 'Media Width',
												name: 'width',
												type: 'number',
												default: 0,
												description: 'Width of the media in pixels',
											},
											{
												displayName: 'Message Text',
												name: 'text',
												type: 'string',
												default: '',
												description: 'Text content of the message (required for text messages)',
											},
											{
												displayName: 'Message Type',
												name: 'type',
												type: 'options',
													required:	true,
												default: 'text',
												description: 'Type of message (text or media)',
												options: [
													{
														name: 'Text Message',
														value: 'text',
													},
													{
														name: 'Photo/Image',
														value: 'photo',
													},
													{
														name: 'Video',
														value: 'video',
													},
												]
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
          "Configure the voice settings for text-to-speech generation of conversation messages",
        required: true,
        default: {},
        options: [
          {
            displayName: "Left Person Voice",
            name: "leftVoice",
            type: "collection",
            description:
              "Voice settings for the person on the left side of the conversation",
            default: {},
            options: [
              {
                displayName: "Voice ID",
                name: "voiceId",
                type: "options",
                default: '21m00Tcm4TlvDq8ikWAM',
                description: "ElevenLabs voice ID for the left person",
                options: [
                  { name: "Arnold (Male)", value: "VR6AewLTigWG4xSOukaG" },
                  { name: "Bella (Female)", value: "EXAVITQu4vr4xnSDxMaL" },
                  { name: "Domi (Female)", value: "AZnzlk1XvdvUeBnXmlld" },
                  { name: "Josh (Male)", value: "21j0vfeTClDxlSDvGRl" },
                  { name: "Rachel (Female)", value: "21m00Tcm4TlvDq8ikWAM" },
                ],
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
                displayName: "Stability",
                name: "stability",
                type: "number",
                default: 0.4,
                description: 'Voice stability setting (0.0-1.0). Higher values = more stable but less expressive.',
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
            displayName: "Right Person Voice",
            name: "rightVoice",
            type: "collection",
            description:
              "Voice settings for the person on the right side of the conversation",
            default: {},
            options: [
              {
                displayName: "Voice ID",
                name: "voiceId",
                type: "options",
                default: '21m00Tcm4TlvDq8ikWAM',
                description: "ElevenLabs voice ID for the right person",
                options: [
                  { name: "Arnold (Male)", value: "VR6AewLTigWG4xSOukaG" },
                  { name: "Bella (Female)", value: "EXAVITQu4vr4xnSDxMaL" },
                  { name: "Domi (Female)", value: "AZnzlk1XvdvUeBnXmlld" },
                  { name: "Josh (Male)", value: "21j0vfeTClDxlSDvGRl" },
                  { name: "Rachel (Female)", value: "21m00Tcm4TlvDq8ikWAM" },
                ],
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
                displayName: "Stability",
                name: "stability",
                type: "number",
                default: 0.4,
                description: 'Voice stability setting (0.0-1.0). Higher values = more stable but less expressive.',
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
        ],
      },
      {
        displayName: "Theme",
        name: "theme",
        type: "options",
        description: "Visual theme for the conversation interface",
        default: "light",
        options: [
          { name: "Light", value: "light" },
          { name: "Dark", value: "dark" },
        ],
      },
      {
        displayName: 'Message Gap (Seconds)',
        name: "messageGap",
        type: "number",
        description: "Time gap between messages in seconds (0.1-10 seconds)",
        default: 1.0,
        typeOptions: { minValue: 0.1, maxValue: 10 },
      },
      {
        displayName: "Playback Speed",
        name: "speed",
        type: "number",
        description: "Video playback speed multiplier (0.5-3.0x)",
        default: 1.0,
        typeOptions: { minValue: 0.5, maxValue: 3.0 },
      },
      {
        displayName: "Emoji Style",
        name: "emojiType",
        type: "options",
        description: "Emoji style to use in the conversation",
        default: "apple",
        options: [
          { name: "Facebook", value: "facebook" },
          { name: "Twitter", value: "twitter" },
          { name: "Apple", value: "apple" },
          { name: "Google", value: "google" },
        ],
      },
      {
        displayName: "Contact Information",
        name: "contactInfo",
        type: "collection",
        description:
          "Contact information to display in the conversation header",
        default: {},
        options: [
          {
            displayName: "Contact Name",
            name: "name",
            type: "string",
            description:
              "Name of the contact (e.g., 'John Doe', 'Sarah Smith')",
            typeOptions: { maxLength: 100 },
            default: "",
          },
          {
            displayName: "Message Count",
            name: "messageCount",
            type: "number",
            description: "Number of messages in the conversation (0-10000)",
            typeOptions: { minValue: 0, maxValue: 10000 },
            default: 0,
          },
          {
            displayName: "Nickname",
            name: "nickname",
            type: "string",
            description: "Nickname or display name (e.g., 'Johnny', 'Sara')",
            typeOptions: { maxLength: 50 },
            default: "",
          },
          {
            displayName: "Profile Image URL",
            name: "image",
            type: "string",
            description: "URL of the contact's profile image",
            default: "",
          },
        ],
      },
      {
        displayName: "Typography Settings",
        name: "typography",
        type: "collection",
        description: "Font and color settings for the conversation text",
        default: {},
        options: [
          {
            displayName: "Left Person Typography",
            name: "left",
            type: "collection",
            description: "Typography settings for the left person's messages",
            default: {},
            options: [
              {
                displayName: "Background Color",
                name: "backgroundColor",
                type: 'color',
                description: "Message bubble background color for left person",
                default: "",
              },
              {
                displayName: "Font Family",
                name: "font",
                type: "string",
                description: "Font family for left person's messages",
                typeOptions: { maxLength: 100 },
                default: "",
              },
              {
                displayName: "Font Size",
                name: "fontSize",
                type: "number",
                description: "Font size in pixels (8-72px)",
                typeOptions: { minValue: 8, maxValue: 72 },
                default: 0,
              },
              {
                displayName: "Text Color",
                name: "color",
                type: 'color',
                description: "Text color for left person's messages",
                default: "",
              },
            ],
          },
          {
            displayName: "Right Person Typography",
            name: "right",
            type: "collection",
            description: "Typography settings for the right person's messages",
            default: {},
            options: [
              {
                displayName: "Background Color",
                name: "backgroundColor",
                type: 'color',
                description: "Message bubble background color for right person",
                default: "",
              },
              {
                displayName: "Font Family",
                name: "font",
                type: "string",
                description: "Font family for right person's messages",
                typeOptions: { maxLength: 100 },
                default: "",
              },
              {
                displayName: "Font Size",
                name: "fontSize",
                type: "number",
                description: "Font size in pixels (8-72px)",
                typeOptions: { minValue: 8, maxValue: 72 },
                default: 0,
              },
              {
                displayName: "Text Color",
                name: "color",
                type: 'color',
                description: "Text color for right person's messages",
                default: "",
              },
            ],
          },
        ],
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
            name: "prompt",
            type: "string",
            description: "Prompt for AI background generation",
            typeOptions: { minValue: 5, maxValue: 500 },
            default: "",
          },
          {
            displayName: "Background Type",
            name: "type",
            type: "options",
            default: "default",
            description: "Type of background to use for the video",
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
            description: "Used when background type is 'custom'",
            typeOptions: { maxLength: 200 },
            default: "",
          },
          {
            displayName: "Preset Prompt",
            name: "presetPrompt",
            type: "string",
            description: "Used when background type is 'preset'",
            typeOptions: { maxLength: 200 },
            default: "",
          },
          {
            displayName: "Selected Background ID",
            name: "selectedBackgroundId",
            type: "string",
            description: "ID of pre-selected background",
            typeOptions: { maxLength: 100 },
            default: "",
          },
          {
            displayName: "Upload Background File",
            name: "uploadedFile",
            type: "string",
            description: "Upload background image file",
            default: "",
          },
          {
            displayName: "Uploaded File URL",
            name: "uploadedFileUrl",
            type: "string",
            description: "URL of uploaded background image",
            default: "",
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
        url: `${BASE_URL}/fake-text`,
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
