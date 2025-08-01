import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from "n8n-workflow";

export class EderoAiClientVideos implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Edero.ai Create Video",
    name: "ederoAiClientVideos",
    icon: "file:ederoAiClientVideos.svg",
    group: ["transform"],
    version: 1,
    description: "Create videos with Edero.ai",
    defaults: {
      name: "Edero.ai Create Video",
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
        displayName: 'Resource',
        name: 'resource',
        type: 'hidden',
        default: 'video',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Fake Text',
            value: 'fakeText',
            action: 'Create a fake text video',
          },
          {
            name: 'Quiz',
            value: 'quiz',
            action: 'Create a quiz video',
          },
          {
            name: 'Reddit Story',
            value: 'redditStory',
            action: 'Create a reddit story video',
          },
          {
            name: 'Get Task Status',
            value: 'getTaskStatus',
            action: 'Get the status of a task',
          },
        ],
        default: 'fakeText',
      },
      {
        displayName: "Task ID",
        name: "taskId",
        type: "string",
        required: true,
        default: "",
        displayOptions: {
          show: {
            resource: ["video"],
            operation: ["getTaskStatus"],
          },
        },
      },
      // Common properties
      {
        displayName: "Video Name",
        name: "name",
        type: "string",
        description: "A descriptive name for your video",
        required: true,
        default: "",
        typeOptions: {
          minValue: 1,
          maxLength: 255,
        },
      },
      // Fake Text properties
      {
        displayName: "Message Template",
        name: "template",
        type: "options",
        description: "Choose the messaging platform style for your conversation",
        required: true,
        default: "iMessage",
        options: [
          { name: "iMessage", value: "iMessage" },
          { name: "WhatsApp", value: "whatsapp" },
          { name: "Instagram", value: "instagram" },
          { name: "Tinder", value: "tinder" },
        ],
        displayOptions: {
          show: {
            resource: ["video"],
            operation: ["fakeText"],
          },
        },
      },
      {
        displayName: "Messages",
        name: "messages",
        type: "fixedCollection",
        description: "Array of messages in the conversation. Each message can be text or media (photos/videos).",
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
                required: true,
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
        displayOptions: {
          show: {
            resource: ["video"],
            operation: ["fakeText"],
          },
        },
      },
      // Quiz properties
      {
        displayName: "Quiz Questions",
        name: "questions",
        type: "fixedCollection",
        description: "Array of quiz questions with their answers. Each question can have multiple answer options.",
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
                description: "The question text to display (e.g., 'What is the capital of France?')",
                typeOptions: { minValue: 1, maxLength: 500 },
              },
              {
                displayName: "Answer Options",
                name: "answers",
                type: "fixedCollection",
                description: "Array of possible answers for this question. Include the correct answer and distractors.",
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
                        description: "The answer text to display (e.g., 'Paris', 'London', 'Berlin')",
                        typeOptions: { minValue: 1, maxLength: 200 },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        displayOptions: {
          show: {
            resource: ["video"],
            operation: ["quiz"],
          },
        },
      },
      // Reddit Story properties
      {
        displayName: "Story Source Configuration",
        name: "storySource",
        type: "collection",
        description: "Configure where to get the story content from - either a Reddit post URL or custom story content",
        required: true,
        default: {},
        options: [
          {
            displayName: "Custom Story Content",
            name: "customContent",
            type: "string",
            default: "",
            description: "Your custom story text content (required when type is 'custom'). Write your story here.",
            typeOptions: { minValue: 10, maxLength: 10000 },
          },
          {
            displayName: "Reddit Post URL",
            name: "redditUrl",
            type: "string",
            default: "",
            description: 'Full Reddit post URL (required when type is \'reddit\'). Format: https://www.reddit.com/r/subreddit/comments/postid/title/.',
          },
          {
            displayName: "Source Type",
            name: "type",
            type: "options",
            default: "reddit",
            description: "Choose between Reddit post URL or custom story content",
            options: [
              { name: "Custom Story", value: "custom" },
              { name: "Reddit Post", value: "reddit" },
            ],
          },
          {
            displayName: "Story Title",
            name: "title",
            type: "string",
            default: "",
            description: "Title for your custom story (required when type is 'custom'). This will be the main headline.",
            typeOptions: { minValue: 1, maxLength: 255 },
          },
        ],
        displayOptions: {
          show: {
            resource: ["video"],
            operation: ["redditStory"],
          },
        },
      },
      // Common properties
      {
        displayName: "Voice Configuration",
        name: "voiceSettings",
        type: "collection",
        description: "Configure the voice settings for text-to-speech generation",
        required: true,
        default: {},
        options: [
          {
            displayName: "Left Person Voice",
            name: "leftVoice",
            type: "collection",
            description: "Voice settings for the person on the left side of the conversation",
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
            description: "Voice settings for the person on the right side of the conversation",
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
        displayOptions: {
          show: {
            resource: ["video"],
            operation: ["fakeText", "quiz", "redditStory"],
          },
        },
      },
      {
        displayName: "Background Configuration",
        name: "backgroundSettings",
        type: "collection",
        description: "Configure the video background (optional - uses default if not specified)",
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
        displayOptions: {
          show: {
            resource: ["video"],
            operation: ["fakeText", "quiz", "redditStory"],
          },
        },
      },
      {
        displayName: "Advanced",
        name: "advanced",
        type: "collection",
        description: "Advanced options",
        default: {},
        options: [
          {
            displayName: 'Answer Display Time (Seconds)',
            name: "answerDisplayTime",
            type: "number",
            description: "How long to display each answer (1-30 seconds)",
            default: 3,
            typeOptions: { minValue: 1, maxValue: 30 },
            displayOptions: {
              show: {
                resource: ["video"],
                operation: ["quiz"],
              },
            },
          },
          {
            displayName: "Answer Template",
            name: "answerTemplate",
            type: "string",
            description: "Template for answer display. Use {{answer}} placeholder to show the selected answer.",
            default: "",
            typeOptions: { maxLength: 500 },
            displayOptions: {
              show: {
                resource: ["video"],
                operation: ["quiz"],
              },
            },
          },
          {
            displayName: "Contact Information",
            name: "contactInfo",
            type: "collection",
            description: "Contact information to display in the conversation header",
            default: {},
            options: [
              {
                displayName: "Contact Name",
                name: "name",
                type: "string",
                description: "Name of the contact (e.g., 'John Doe', 'Sarah Smith')",
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
            displayOptions: {
              show: {
                resource: ["video"],
                operation: ["fakeText"],
              },
            },
          },
          {
            displayName: "Custom Story Metadata",
            name: "customStoryMetadata",
            type: "collection",
            description: "Additional metadata for custom stories (only applies when storySource.type is 'custom')",
            default: {},
            options: [
              {
                displayName: "Author Name",
                name: "author",
                type: "string",
                default: "",
                description: "Author name for the custom story (e.g., 'Throwaway123')",
                typeOptions: { maxLength: 100 },
              },
              {
                displayName: "Number of Comments",
                name: "numComments",
                type: "number",
                default: 0,
                description: "Number of comments for the custom story (0-10000)",
                typeOptions: { minValue: 0, maxValue: 10000 },
              },
              {
                displayName: "Post Score",
                name: "score",
                type: "number",
                default: 1,
                description: "Reddit post score for the custom story (-1000 to 100000)",
                typeOptions: { minValue: -1000, maxValue: 100000 },
              },
              {
                displayName: "Subreddit Name",
                name: "subreddit",
                type: "string",
                default: "",
                description: "Subreddit name for the custom story (without 'r/' prefix, e.g., 'AmItheAsshole')",
                typeOptions: { maxLength: 50 },
              },
              {
                displayName: "Upvote Ratio",
                name: "upvoteRatio",
                type: "number",
                default: 1.0,
                description: "Upvote ratio for the custom story (0.0-1.0, where 1.0 = 100% upvoted)",
                typeOptions: { minValue: 0, maxValue: 1 },
              },
            ],
            displayOptions: {
              show: {
                resource: ["video"],
                operation: ["redditStory"],
              },
            },
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
            displayOptions: {
              show: {
                resource: ["video"],
                operation: ["fakeText"],
              },
            },
          },
          {
            displayName: 'Message Gap (Seconds)',
            name: "messageGap",
            type: "number",
            description: "Time gap between messages in seconds (0.1-10 seconds)",
            default: 1.0,
            typeOptions: { minValue: 0.1, maxValue: 10 },
            displayOptions: {
              show: {
                resource: ["video"],
                operation: ["fakeText"],
              },
            },
          },
          {
            displayName: "Playback Speed",
            name: "speed",
            type: "number",
            description: "Video playback speed multiplier (0.5-3.0x)",
            default: 1.0,
            typeOptions: { minValue: 0.5, maxValue: 3.0 },
            displayOptions: {
              show: {
                resource: ["video"],
                operation: ["fakeText"],
              },
            },
          },
          {
            displayName: 'Question Display Time (Seconds)',
            name: "questionDisplayTime",
            type: "number",
            description: "How long to display each question before showing the answer (1-60 seconds)",
            default: 5,
            typeOptions: { minValue: 1, maxValue: 60 },
            displayOptions: {
              show: {
                resource: ["video"],
                operation: ["quiz"],
              },
            },
          },
          {
            displayName: "Reddit Post Settings",
            name: "redditSettings",
            type: "collection",
            description: "Configure how to process Reddit post comments (only applies when storySource.type is 'reddit')",
            default: {},
            options: [
              {
                displayName: "Comment Depth Limit",
                name: "depthLimit",
                type: "number",
                default: 3,
                description: "Maximum depth of comment replies to include (0-10)",
                typeOptions: { minValue: 0, maxValue: 10 },
              },
              {
                displayName: "Comment Limit",
                name: "commentLimit",
                type: "number",
                default: 5,
                description: "Maximum number of comments to include in the video (0-50)",
                typeOptions: { minValue: 0, maxValue: 50 },
              },
              {
                displayName: "Include Comments",
                name: "includeComments",
                type: "boolean",
                default: true,
                description: "Whether to include Reddit comments in the video (if false, only post content is used)",
              },
              {
                displayName: "Minimum Comment Score",
                name: "minScore",
                type: "number",
                default: -100,
                description: "Minimum Reddit score for comments to be included (-1000 to 10000)",
                typeOptions: { minValue: -1000, maxValue: 10000 },
              },
            ],
            displayOptions: {
              show: {
                resource: ["video"],
                operation: ["redditStory"],
              },
            },
          },
          {
            displayName: "Show Correct Answers",
            name: "showCorrectAnswers",
            type: "boolean",
            description: "Whether to highlight correct answers in the video",
            default: true,
            displayOptions: {
              show: {
                resource: ["video"],
                operation: ["quiz"],
              },
            },
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
            displayOptions: {
              show: {
                resource: ["video"],
                operation: ["fakeText"],
              },
            },
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
      const operation = this.getNodeParameter('operation', i) as string;
      const body: any = {
        name: this.getNodeParameter('name', i),
      };

      let url = `${BASE_URL}/`;

      if (operation === 'fakeText') {
        url += 'fake-text';
        body.template = this.getNodeParameter('template', i);
        body.messages = this.getNodeParameter('messages', i);
        body.voiceSettings = this.getNodeParameter('voiceSettings', i);
        const advanced = this.getNodeParameter('advanced', i) as any;
        body.messageGap = advanced.messageGap;
        body.speed = advanced.speed;
        body.emojiType = advanced.emojiType;
        body.contactInfo = advanced.contactInfo;
        body.typography = advanced.typography;
      } else if (operation === 'quiz') {
        url += 'quiz';
        body.questions = this.getNodeParameter('questions', i);
        body.voiceSettings = this.getNodeParameter('voiceSettings', i);
        const advanced = this.getNodeParameter('advanced', i) as any;
        body.questionDisplayTime = advanced.questionDisplayTime;
        body.answerDisplayTime = advanced.answerDisplayTime;
        body.showCorrectAnswers = advanced.showCorrectAnswers;
        body.answerTemplate = advanced.answerTemplate;
      } else if (operation === 'redditStory') {
        url += 'reddit-story';
        body.storySource = this.getNodeParameter('storySource', i);
        body.voiceSettings = this.getNodeParameter('voiceSettings', i);
        const advanced = this.getNodeParameter('advanced', i) as any;
        body.redditSettings = advanced.redditSettings;
        body.customStoryMetadata = advanced.customStoryMetadata;
      } else if (operation === 'getTaskStatus') {
        const taskId = this.getNodeParameter('taskId', i) as string;
        url += `task/${taskId}`;
        const response = await this.helpers.request({
          method: 'GET' as const,
          url,
          headers: {
            Authorization: `Bearer ${credentials.apiKey}`,
          },
          json: true,
        });
        returnData.push({ json: response });
        continue;
      }

      body.backgroundSettings = this.getNodeParameter('backgroundSettings', i);

      const response = await this.helpers.request({
        method: 'POST' as const,
        url,
        headers: {
          Authorization: `Bearer ${credentials.apiKey}`,
          'Content-Type': 'application/json',
        },
        body,
        json: true,
      });
      returnData.push({ json: response });
    }
    return [returnData];
  }
}
