import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class RedditStory implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Create Reddit Story Video',
		name: 'createRedditStoryVideo',
		group: ['transform'],
		version: 1,
		description: 'Generate a video from a Reddit post or custom story',
		defaults: {
			name: 'Create Reddit Story Video',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'videos-client',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Video Name',
				name: 'name',
				type: 'string',
				description: "A descriptive name for your Reddit story video (e.g., 'My Crazy Reddit Story', 'Viral Confession')",
				required: true,
				default: '',
				typeOptions: { minValue: 1, maxLength: 255 },
			},
			{
				displayName: 'Video Template',
				name: 'template',
				type: 'options',
				description: 'Video template style for story presentation (currently only TextOnly is supported)',
				required: false,
				default: 'TextOnly',
				options: [
					{ name: 'Text Only', value: 'TextOnly' },
				],
			},
			{
				displayName: 'Story Source Configuration',
				name: 'storySource',
				type: 'collection',
				description: 'Configure where to get the story content from - either a Reddit post URL or custom story content',
				required: true,
				default: {},
				options: [
					{
						name: 'type',
						displayName: 'Source Type',
						type: 'options',
						required: true,
						default: 'reddit',
						description: 'Choose between Reddit post URL or custom story content',
						options: [
							{ name: 'Reddit Post', value: 'reddit' },
							{ name: 'Custom Story', value: 'custom' },
						],
					},
					{
						name: 'redditUrl',
						displayName: 'Reddit Post URL',
						type: 'string',
						required: false,
						default: '',
						description: "Full Reddit post URL (required when type is 'reddit'). Format: https://www.reddit.com/r/subreddit/comments/postid/title/",
					},
					{
						name: 'customContent',
						displayName: 'Custom Story Content',
						type: 'string',
						required: false,
						default: '',
						description: 'Your custom story text content (required when type is \'custom\'). Write your story here.',
						typeOptions: { minValue: 10, maxLength: 10000 },
					},
					{
						name: 'title',
						displayName: 'Story Title',
						type: 'string',
						required: false,
						default: '',
						description: 'Title for your custom story (required when type is \'custom\'). This will be the main headline.',
						typeOptions: { minValue: 1, maxLength: 255 },
					},
				],
			},
			{
				displayName: 'Voice Configuration',
				name: 'voiceSettings',
				type: 'collection',
				description: 'Configure the voice settings for text-to-speech generation of your story',
				required: true,
				default: {},
				options: [
					{
						name: 'voiceId',
						displayName: 'Voice ID',
						type: 'options',
						required: true,
						default: '21m00Tcm4TlvDq8ikWAM',
						description: 'ElevenLabs voice ID for the left person',
						options: [
							{ value: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Female)' },
							{ value: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi (Female)' },
							{ value: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (Female)' },
							{ value: '21j0vfeTClDxlSDvGRl', name: 'Josh (Male)' },
							{ value: 'VR6AewLTigWG4xSOukaG', name: 'Arnold (Male)' },
							{ value: 'VR6AewLTigWG4xSOukaG', name: 'Adam (Male)' },
						],
					},
					{
						displayName: 'Voice Stability',
						name: 'stability',
						type: 'number',
						required: false,
						default: 0.4,
						description: 'Voice stability setting (0.0-1.0). Higher values = more stable but less expressive voice',
						typeOptions: { minValue: 0, maxValue: 1 },
					},
					{
						displayName: 'Similarity Boost',
						name: 'similarityBoost',
						type: 'number',
						required: false,
						default: 0.45,
						description: 'Voice similarity boost (0.0-1.0). Higher values = more similar to original voice',
						typeOptions: { minValue: 0, maxValue: 1 },
					},
					{
						displayName: 'Style Exaggeration',
						name: 'styleExaggeration',
						type: 'number',
						required: false,
						default: 0.5,
						description: 'Style exaggeration setting (0.0-1.0). Higher values = more dramatic style',
						typeOptions: { minValue: 0, maxValue: 1 },
					},
				],
			},
			{
				displayName: 'Reddit Post Settings',
				name: 'redditSettings',
				type: 'collection',
				description: 'Configure how to process Reddit post comments (only applies when storySource.type is \'reddit\')',
				required: false,
				default: {},
				options: [
					{
						name: 'commentLimit',
						displayName: 'Comment Limit',
						type: 'number',
						required: false,
						default: 5,
						description: 'Maximum number of comments to include in the video (0-50)',
						typeOptions: { minValue: 0, maxValue: 50 },
					},
					{
						name: 'depthLimit',
						displayName: 'Comment Depth Limit',
						type: 'number',
						required: false,
						default: 3,
						description: 'Maximum depth of comment replies to include (0-10)',
						typeOptions: { minValue: 0, maxValue: 10 },
					},
					{
						name: 'minScore',
						displayName: 'Minimum Comment Score',
						type: 'number',
						required: false,
						default: -100,
						description: 'Minimum Reddit score for comments to be included (-1000 to 10000)',
						typeOptions: { minValue: -1000, maxValue: 10000 },
					},
					{
						name: 'includeComments',
						displayName: 'Include Comments',
						type: 'boolean',
						required: false,
						default: true,
						description: 'Whether to include Reddit comments in the video (if false, only post content is used)',
					},
				],
			},
			{
				displayName: 'Custom Story Metadata',
				name: 'customStoryMetadata',
				type: 'collection',
				description: 'Additional metadata for custom stories (only applies when storySource.type is \'custom\')',
				required: false,
				default: {},
				options: [
					{
						name: 'subreddit',
						displayName: 'Subreddit Name',
						type: 'string',
						required: false,
						default: '',
						description: "Subreddit name for the custom story (without 'r/' prefix, e.g., 'AmItheAsshole')",
						typeOptions: { maxLength: 50 },
					},
					{
						name: 'author',
						displayName: 'Author Name',
						type: 'string',
						required: false,
						default: '',
						description: "Author name for the custom story (e.g., 'Throwaway123')",
						typeOptions: { maxLength: 100 },
					},
					{
						name: 'score',
						displayName: 'Post Score',
						type: 'number',
						required: false,
						default: 1,
						description: 'Reddit post score for the custom story (-1000 to 100000)',
						typeOptions: { minValue: -1000, maxValue: 100000 },
					},
					{
						name: 'upvoteRatio',
						displayName: 'Upvote Ratio',
						type: 'number',
						required: false,
						default: 1.0,
						description: 'Upvote ratio for the custom story (0.0-1.0, where 1.0 = 100% upvoted)',
						typeOptions: { minValue: 0, maxValue: 1 },
					},
					{
						name: 'numComments',
						displayName: 'Number of Comments',
						type: 'number',
						required: false,
						default: 0,
						description: 'Number of comments for the custom story (0-10000)',
						typeOptions: { minValue: 0, maxValue: 10000 },
					},
				],
			},
			{
				displayName: 'Background Configuration',
				name: 'backgroundSettings',
				type: 'collection',
				description: 'Configure the video background (optional - uses default if not specified)',
				required: false,
				default: {},
				options: [
					{
						name: 'type',
						displayName: 'Background Type',
						type: 'options',
						required: false,
						default: 'default',
						description: 'Type of background to use for the video',
						options: [
							{ name: 'Default Background', value: 'default' },
							{ name: 'Upload Custom File', value: 'upload' },
							{ name: 'AI Generated', value: 'generate' },
						],
					},
					{
						name: 'uploadedFile',
						displayName: 'Upload Background File',
						type: 'string',
						required: false,
						default: '',
						description: "Upload an image or video file for the background (required when type is 'upload')",
					},
					{
						name: 'prompt',
						displayName: 'AI Generation Prompt',
						type: 'string',
						required: false,
						default: '',
						description: "Text prompt for AI-generated background (required when type is 'generate'). Describe the background you want.",
						typeOptions: { minValue: 5, maxLength: 500 },
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('videos-client');
		const BASE_URL = 'https://app.edero.ai/api/public';

		for (let i = 0; i < items.length; i++) {
			// You would need to transform the n8n parameters into the correct API body here
			const body = this.getNodeParameter('name', i);
			// ... build the body from all parameters ...
			const response = await this.helpers.request({
				method: 'POST' as const,
				url: `${BASE_URL}/reddit-story`,
				headers: {
					'Authorization': `Bearer ${credentials.apiKey}`,
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