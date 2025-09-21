import Anthropic from '@anthropic-ai/sdk';

class AnthropicService {
  constructor() {
    this.client = null;
    this.isInitialized = false;
  }

  // 初始化Anthropic客户端
  initialize(apiKey) {
    try {
      const config = {
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // 允许在浏览器中使用
      };
      
      // Anthropic SDK使用官方API端点，不支持自定义baseURL
      this.client = new Anthropic(config);
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Anthropic客户端初始化失败:', error);
      this.isInitialized = false;
      return false;
    }
  }

  // 配置Anthropic客户端（与initialize方法相同，为了兼容性）
  configure(config) {
    return this.initialize(config.apiKey);
  }

  // 检查是否已初始化
  checkInitialized() {
    if (!this.isInitialized || !this.client) {
      throw new Error('Anthropic客户端未初始化，请先调用initialize方法');
    }
  }

  // 发送消息（支持流式和非流式）
  async sendMessage(messages, options = {}) {
    this.checkInitialized();
    
    try {
      // 如果是流式请求
      if (options.stream) {
        const result = await this.sendStreamMessage(messages, options.model || 'claude-3-5-sonnet-20241022', options, options.onChunk);
        if (options.onComplete) {
          options.onComplete(result);
        }
        return result;
      } else {
        // 非流式请求
        return await this.sendNonStreamMessage(messages, options.model || 'claude-3-5-sonnet-20241022', options);
      }
    } catch (error) {
      console.error('Anthropic API调用失败:', error);
      if (options.onError) {
        options.onError(error);
      }
      throw error;
    }
  }

  // 发送流式消息
  async sendStreamMessage(messages, model = 'claude-3-5-sonnet-20241022', options = {}, onChunk = null) {
    this.checkInitialized();
    
    try {
      // 转换消息格式为Anthropic格式
      const anthropicMessages = this.convertMessagesToAnthropicFormat(messages);
      
      let fullContent = '';
      
      // 创建流式请求
      const stream = await this.client.messages.create({
        model: model,
        max_tokens: options.max_tokens || 4096,
        temperature: options.temperature || 0.7,
        messages: anthropicMessages,
        stream: true
      });

      // 处理流式响应
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
          fullContent += chunk.delta.text;
          
          // 调用回调函数更新UI
          if (onChunk) {
            onChunk(fullContent);
          }
        }
      }

      return fullContent;
    } catch (error) {
      console.error('Anthropic流式API调用失败:', error);
      throw error;
    }
  }

  // 发送非流式消息
  async sendNonStreamMessage(messages, model = 'claude-3-5-sonnet-20241022', options = {}) {
    this.checkInitialized();
    
    try {
      // 转换消息格式为Anthropic格式
      const anthropicMessages = this.convertMessagesToAnthropicFormat(messages);
      
      const response = await this.client.messages.create({
        model: model,
        max_tokens: options.max_tokens || 4096,
        temperature: options.temperature || 0.7,
        messages: anthropicMessages
      });

      // 提取文本内容
      const content = response.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('');

      return content;
    } catch (error) {
      console.error('Anthropic非流式API调用失败:', error);
      throw error;
    }
  }

  // 将消息转换为Anthropic格式
  convertMessagesToAnthropicFormat(messages) {
    const anthropicMessages = [];
    
    for (const message of messages) {
      // 跳过系统消息，Anthropic有单独的system参数
      if (message.role === 'system') {
        continue;
      }
      
      // 处理用户和助手消息
      if (message.role === 'user' || message.role === 'assistant') {
        let content;
        
        // 处理多模态内容（图片等）
        if (Array.isArray(message.content)) {
          content = [];
          for (const item of message.content) {
            if (item.type === 'text') {
              content.push({
                type: 'text',
                text: item.text
              });
            } else if (item.type === 'image_url') {
              // 处理图片内容
              const imageData = this.extractImageData(item.image_url.url);
              if (imageData) {
                content.push({
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: imageData.mediaType,
                    data: imageData.data
                  }
                });
              }
            }
          }
        } else {
          // 纯文本内容
          content = message.content;
        }
        
        anthropicMessages.push({
          role: message.role,
          content: content
        });
      }
    }
    
    return anthropicMessages;
  }

  // 提取图片数据
  extractImageData(imageUrl) {
    try {
      // 检查是否是base64格式的图片
      if (imageUrl.startsWith('data:image/')) {
        const [header, data] = imageUrl.split(',');
        const mediaType = header.match(/data:(image\/[^;]+)/)?.[1];
        
        return {
          mediaType: mediaType || 'image/jpeg',
          data: data
        };
      }
      
      return null;
    } catch (error) {
      console.error('提取图片数据失败:', error);
      return null;
    }
  }

  // 发送带图片的消息
  async sendMessageWithImage(messages, imageUrl, model = 'claude-3-5-sonnet-20241022', options = {}) {
    this.checkInitialized();
    
    try {
      // 构建包含图片的消息
      const imageData = this.extractImageData(imageUrl);
      if (!imageData) {
        throw new Error('无效的图片格式');
      }

      // 获取最后一条用户消息
      const lastUserMessage = messages[messages.length - 1];
      const textContent = lastUserMessage?.content || '请分析这张图片';

      // 构建多模态消息
      const multiModalMessage = {
        role: 'user',
        content: [
          {
            type: 'text',
            text: textContent
          },
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: imageData.mediaType,
              data: imageData.data
            }
          }
        ]
      };

      // 构建消息历史（排除最后一条用户消息）
      const messageHistory = messages.slice(0, -1);
      messageHistory.push(multiModalMessage);

      return await this.sendMessage(messageHistory, { ...options, model });
    } catch (error) {
      console.error('Anthropic图片消息发送失败:', error);
      throw error;
    }
  }

  // 获取可用模型列表
  async getModels() {
    // Anthropic API目前不提供模型列表接口，返回常用模型
    return [
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        description: 'Anthropic最新的高性能模型'
      },
      {
        id: 'claude-3-5-haiku-20241022',
        name: 'Claude 3.5 Haiku',
        description: '快速且经济的模型'
      },
      {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        description: '最强大的Claude 3模型'
      },
      {
        id: 'claude-3-sonnet-20240229',
        name: 'Claude 3 Sonnet',
        description: '平衡性能和速度的模型'
      },
      {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        description: '快速响应的轻量级模型'
      }
    ];
  }

  // 文件上传（Anthropic不直接支持文件上传，返回错误）
  async uploadFile(file, purpose = 'assistants') {
    throw new Error('Anthropic API暂不支持文件上传功能');
  }

  // 获取文件信息（Anthropic不支持）
  async getFileInfo(fileId) {
    throw new Error('Anthropic API暂不支持文件管理功能');
  }

  // 删除文件（Anthropic不支持）
  async deleteFile(fileId) {
    throw new Error('Anthropic API暂不支持文件管理功能');
  }
}

// 创建单例实例
const anthropicService = new AnthropicService();

export default anthropicService;