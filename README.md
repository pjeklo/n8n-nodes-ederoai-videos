# n8n-nodes-ederoai-videos
<div align="center">
  <img src="https://edero.ai/wp-content/uploads/2021/01/edero.png" alt="edero.ai" height="64" >
  <br>
  <strong>Powered by <a href="https://edero.ai/">edero.ai</a></strong>
</div>

[![edero.ai](https://img.shields.io/badge/Powered%20by-edero.ai-FF6B35?style=flat&logo=video&logoColor=white)](https://edero.ai/)
[![n8n](https://img.shields.io/badge/n8n-Community%20Node-EA4B71?style=flat)](https://n8n.io/)
[![npm](https://img.shields.io/npm/v/n8n-nodes-ederoai-videos?color=CB3837&logo=npm)](https://www.npmjs.com/package/n8n-nodes-ederoai-videos)

This is an n8n community node. It lets you use **[edero.ai](https://edero.ai/)** in your n8n workflows.

**[edero.ai](https://edero.ai/)** is an AI-powered video creation platform that lets you generate quiz, fake text, and story videos programmatically, and track their status.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## 📦 Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

Install this package:
```
npm install n8n-nodes-ederoai-videos
```

## 🎬 Operations

This node supports the following **[edero.ai](https://edero.ai/)** operations:

- 🧠 **Create Quiz Video**: Generate interactive quiz videos from questions and answers
- 💬 **Create Fake Text Video**: Generate realistic text conversation videos
- 📖 **Create Reddit Story Video**: Generate videos from Reddit posts or custom stories  
- 📊 **Get Task Status**: Check the status and retrieve results of video generation tasks

## 🔐 Credentials

To use this node, you need an **[edero.ai](https://edero.ai/)** API key.

**Prerequisites:**
- 🚀 Sign up for an account at [edero.ai](https://app.edero.ai/)

**Setup:**
1. 🔑 Log in to your [edero.ai dashboard](https://app.edero.ai/)
2. 🔧 Navigate to [Integrations](https://app.edero.ai/integrations) 
3. ⚡ Generate a new API key
4. 📝 In n8n, create a new credential of type "edero.ai Videos API"
5. ✅ Enter your API key in the credential configuration

## ✅ Compatibility

- **Minimum n8n version:** 1.0.0
- **Tested with:** n8n 1.0.0+
- **Known issues:** None

## 🚀 Usage

1. ➕ Add the **Edero.ai Create Video** node to your workflow.
2. 🔗 Configure the node with your **[edero.ai](https://edero.ai/)** credentials.
3. ⚙️ Select the desired operation from the 'Operation' dropdown.
4. 📝 Fill in the required parameters for your chosen operation.
5. 📹 For video creation operations, save the returned `taskId` and use it with the 'Get Task Status' operation to monitor progress and retrieve the final video URL.

> 💡 **Tip:** Video generation is asynchronous. Always use the 'Get Task Status' operation to check when your video is ready and get the download link.

## 📚 Resources

- 📖 [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- 🎬 [edero.ai API documentation](https://app.edero.ai/integrations)
- 🌐 [edero.ai platform](https://edero.ai/)

<div align="center">
  <br>
  <strong>🎉 Ready to create amazing videos with AI?</strong>
  <br>
  <a href="https://app.edero.ai/">
    <img src="https://img.shields.io/badge/Get%20Started-edero.ai-FF6B35?style=for-the-badge&logo=rocket&logoColor=white" alt="Get Started">
  </a>
</div>