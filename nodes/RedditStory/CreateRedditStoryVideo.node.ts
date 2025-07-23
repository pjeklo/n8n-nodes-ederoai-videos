import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from "n8n-workflow";

export class RedditStory implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Create Reddit Story Video",
    name: "createRedditStoryVideo",
    group: ["transform"],
    version: 1,
    description: "Generate a video from a Reddit post or custom story",
    defaults: {
      name: "Create Reddit Story Video",
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
          "A descriptive name for your Reddit story video (e.g., 'My Crazy Reddit Story', 'Viral Confession')",
        required: true,
        default: "",
        typeOptions: { minValue: 1, maxLength: 255 },
      },
      {
        displayName: "Video Template",
        name: "template",
        type: "options",
        description:
          "Video template style for story presentation (currently only TextOnly is supported)",
        default: "TextOnly",
        options: [{ name: "Text Only", value: "TextOnly" }],
      },
      {
        displayName: "Story Source Configuration",
        name: "storySource",
        type: "collection",
        description:
          "Configure where to get the story content from - either a Reddit post URL or custom story content",
        required: true,
        default: {},
        options: [
          {
            displayName: "Custom Story Content",
            name: "customContent",
            type: "string",
            default: "",
            description:
              "Your custom story text content (required when type is 'custom'). Write your story here.",
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
            description:
              "Choose between Reddit post URL or custom story content",
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
            description:
              "Title for your custom story (required when type is 'custom'). This will be the main headline.",
            typeOptions: { minValue: 1, maxLength: 255 },
          },
        ],
      },
      {
        displayName: "Voice Configuration",
        name: "voiceSettings",
        type: "collection",
        description:
          "Configure the voice settings for text-to-speech generation of your story",
        required: true,
        default: {},
        options: [
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
          {
            displayName: "Voice ID",
            name: "voiceId",
            type: "options",
            default: "21m00Tcm4TlvDq8ikWAM",
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
            displayName: "Voice Stability",
            name: "stability",
            type: "number",
            default: 0.4,
            description: 'Voice stability setting (0.0-1.0). Higher values = more stable but less expressive voice.',
            typeOptions: { minValue: 0, maxValue: 1 },
          },
        ],
      },
      {
        displayName: "Reddit Post Settings",
        name: "redditSettings",
        type: "collection",
        description:
          "Configure how to process Reddit post comments (only applies when storySource.type is 'reddit')",
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
            description:
              "Maximum number of comments to include in the video (0-50)",
            typeOptions: { minValue: 0, maxValue: 50 },
          },
          {
            displayName: "Include Comments",
            name: "includeComments",
            type: "boolean",
            default: true,
            description:
              "Whether to include Reddit comments in the video (if false, only post content is used)",
          },
          {
            displayName: "Minimum Comment Score",
            name: "minScore",
            type: "number",
            default: -100,
            description:
              "Minimum Reddit score for comments to be included (-1000 to 10000)",
            typeOptions: { minValue: -1000, maxValue: 10000 },
          },
        ],
      },
      {
        displayName: "Custom Story Metadata",
        name: "customStoryMetadata",
        type: "collection",
        description:
          "Additional metadata for custom stories (only applies when storySource.type is 'custom')",
        default: {},
        options: [
          {
            displayName: "Author Name",
            name: "author",
            type: "string",
            default: "",
            description:
              "Author name for the custom story (e.g., 'Throwaway123')",
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
            description:
              "Reddit post score for the custom story (-1000 to 100000)",
            typeOptions: { minValue: -1000, maxValue: 100000 },
          },
          {
            displayName: "Subreddit Name",
            name: "subreddit",
            type: "string",
            default: "",
            description:
              "Subreddit name for the custom story (without 'r/' prefix, e.g., 'AmItheAsshole')",
            typeOptions: { maxLength: 50 },
          },
          {
            displayName: "Upvote Ratio",
            name: "upvoteRatio",
            type: "number",
            default: 1.0,
            description:
              "Upvote ratio for the custom story (0.0-1.0, where 1.0 = 100% upvoted)",
            typeOptions: { minValue: 0, maxValue: 1 },
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
            displayName: "AI Generation Prompt",
            name: "prompt",
            type: "string",
            default: "",
            description:
              "Text prompt for AI-generated background (required when type is 'generate'). Describe the background you want.",
            typeOptions: { minValue: 5, maxLength: 500 },
          },
          {
            displayName: "Background Type",
            name: "type",
            type: "options",
            default: "default",
            description: "Type of background to use for the video",
            options: [
              { name: "AI Generated", value: "generate" },
              { name: "Default Background", value: "default" },
              { name: "Upload Custom File", value: "upload" },
            ],
          },
          {
            displayName: "Upload Background File",
            name: "uploadedFile",
            type: "string",
            default: "",
            description:
              "Upload an image or video file for the background (required when type is 'upload')",
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials("videos-client");
    const BASE_URL = "https://app.edero.ai/api/public";

    for (let i = 0; i < items.length; i++) {
      // You would need to transform the n8n parameters into the correct API body here
      const body = this.getNodeParameter("name", i);
      // ... build the body from all parameters ...
      const response = await this.helpers.request({
        method: "POST" as const,
        url: `${BASE_URL}/reddit-story`,
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
