# n8n-nodes-ederoai-videos

This is an n8n community node. It lets you use Edero.ai in your n8n workflows.

Edero.ai is an AI-powered video creation platform that lets you generate quiz, fake text, and story videos programmatically, and track their status.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)

---

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

Install this package in your n8n instance:
```sh
npm install @edero.ai/n8n-nodes-videos
```

---

## Operations

This node supports the following operations:

- **Create Quiz Video**: Generate a quiz video from questions and answers.
- **Create Fake Text Video**: Generate a fake text conversation video.
- **Create Reddit Story Video**: Generate a video from a Reddit post or custom story.
- **Get Task Status**: Check the status of a video generation task by Task ID.

---

## Credentials

To use this node, you need an Edero.ai API key.

1. [Sign up or log in to Edero.ai](https://app.edero.ai/)
2. Go to [Edero.ai Integrations](https://app.edero.ai/integrations) and generate an API key.
3. In n8n, add a new credential for "Edero.ai Videos API" (or `videos-client`).
4. Paste your API key into the credential field.

---

## Compatibility

- **Minimum n8n version:** 1.0.0
- **Tested with:** n8n 1.0.0 and above
- **Known issues:** None

---

## Usage

- Add the desired Edero.ai node (Quiz, FakeText, RedditStory, TaskStatus) to your workflow.
- Fill in the required fields and connect your Edero.ai credential.
- For video creation nodes, use the returned `taskId` with the TaskStatus node to check progress and get the final video link.

For more help, see the [Try it out](https://docs.n8n.io/try-it-out/) documentation.

---

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Edero.ai documentation](https://app.edero.ai/integrations)
* [Edero.ai website](https://edero.ai/) 