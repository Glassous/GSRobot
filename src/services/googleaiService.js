import { GoogleGenAI } from '@google/genai';

class GoogleAIService {
  constructor() {
    this.client = null;
    this.isInitialized = false;
  }

  // 初始化Google AI客户端
  initialize(apiKey, baseURL = null) {
    try {
      const config = {
        apiKey: apiKey
      };
      
      // Google AI SDK 不支持自定义baseURL，但保留参数以保持接口一致性
      if (baseURL && baseURL !== 'https://generativelanguage.googleapis.com') {
        console.warn('Google AI SDK 不支持自定义 baseURL，将使用默认端点');
      }
      
      this.client = new GoogleGenAI(config);
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Google AI客户端初始化失败:', error);
      this.isInitialized = false;
      return false;
    }
  }

  // 配置Google AI客户端（与initialize方法相同，为了兼容性）
  configure(config) {
    return this.initialize(config.apiKey, config.baseURL);
  }

  // 检查是否已初始化
  checkInitialized() {
    if (!this.isInitialized || !this.client) {
      throw new Error('Google AI客户端未初始化，请先调用initialize方法');
    }
  }

  // 发送消息（支持流式和非流式）
  async sendMessage(messages, options = {}) {
    this.checkInitialized();
    
    try {
      // 如果是流式请求
      if (options.stream) {
        const result = await this.sendStreamMessage(messages, options.model || 'gemini-1.5-flash', options, options.onChunk);
        return result;
      } else {
        // 非流式请求
        const response = await this.sendNonStreamMessage(messages, options.model || 'gemini-2.5-flash', options);
        return {
          success: true,
          content: response.content,
          usage: response.usage,
          model: response.model
        };
      }
    } catch (error) {
      console.error('Google AI API调用失败:', error);
      return {
        success: false,
        error: error.message || '发送消息失败'
      };
    }
  }

  // 发送流式消息
  async sendStreamMessage(messages, model = 'gemini-1.5-flash', options = {}, onChunk = null) {
    this.checkInitialized();
    
    try {
      console.log('开始Google AI流式API调用:', { model, messages: messages.length, options });
      
      // 转换消息格式为Google AI格式
      const contents = this.convertMessagesToGoogleFormat(messages);
      
      // 使用正确的流式API调用方式
      const response = await this.client.models.generateContentStream({
        model: model,
        contents: contents,
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.max_tokens || 1000,
          ...options.generationConfig
        }
      });

      console.log('Google AI流式API调用成功，开始处理响应');
      let fullContent = '';
      let chunkCount = 0;
      
      // 直接迭代response，不需要.stream
      for await (const chunk of response) {
        chunkCount++;
        console.log(`处理第${chunkCount}个chunk:`, chunk);
        
        // 检查chunk结构并提取文本
        const chunkText = chunk.text || '';
        
        if (chunkText) {
          fullContent += chunkText;
          console.log('收到内容:', chunkText, '累计内容长度:', fullContent.length);
          
          if (onChunk || options.onChunk) {
            const callback = onChunk || options.onChunk;
            try {
              callback(fullContent); // 传递完整内容而不是增量内容
            } catch (callbackError) {
              console.error('回调函数执行错误:', callbackError);
            }
          }
        }
      }
      
      console.log('流式响应完成，总内容长度:', fullContent.length);
      console.log('完整响应内容:', fullContent);
      
      // 调用完成回调
      if (options.onComplete) {
        try {
          console.log('调用onComplete回调');
          options.onComplete(fullContent);
        } catch (callbackError) {
          console.error('onComplete回调执行错误:', callbackError);
        }
      } else {
        console.log('没有onComplete回调');
      }
      
      return {
        success: true,
        content: fullContent,
        model: model
      };
    } catch (error) {
      console.error('Google AI流式API调用失败:', error);
      console.error('错误详情:', error.message, error.stack);
      
      if (options.onError) {
        try {
          options.onError(error);
        } catch (callbackError) {
          console.error('错误回调执行错误:', callbackError);
        }
      }
      return {
        success: false,
        error: error.message || '发送流式消息失败'
      };
    }
  }

  // 发送非流式消息
  async sendNonStreamMessage(messages, model = 'gemini-1.5-flash', options = {}) {
    this.checkInitialized();
    
    try {
      // 转换消息格式为Google AI格式
      const contents = this.convertMessagesToGoogleFormat(messages);
      
      const response = await this.client.models.generateContent({
        model: model,
        contents: contents,
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.max_tokens || 1000,
          ...options.generationConfig
        }
      });

      const content = response.response.text();
      
      return {
        success: true,
        content: content,
        usage: {
          prompt_tokens: response.response.usageMetadata?.promptTokenCount || 0,
          completion_tokens: response.response.usageMetadata?.candidatesTokenCount || 0,
          total_tokens: response.response.usageMetadata?.totalTokenCount || 0
        },
        model: model
      };
    } catch (error) {
      console.error('Google AI非流式API调用失败:', error);
      return {
        success: false,
        error: error.message || '发送非流式消息失败'
      };
    }
  }

  // 转换OpenAI格式的消息为Google AI格式
  convertMessagesToGoogleFormat(messages) {
    const contents = [];
    
    for (const message of messages) {
      if (message.role === 'system') {
        // Google AI 不支持 system 角色，将其转换为 user 消息
        contents.push({
          role: 'user',
          parts: [{ text: `System: ${message.content}` }]
        });
      } else if (message.role === 'user') {
        if (Array.isArray(message.content)) {
          // 处理多模态内容（文本+图片）
          const parts = [];
          for (const part of message.content) {
            if (part.type === 'text') {
              parts.push({ text: part.text });
            } else if (part.type === 'image_url') {
              // 处理图片URL
              const imageData = this.extractImageData(part.image_url.url);
              if (imageData) {
                parts.push({
                  inlineData: {
                    mimeType: imageData.mimeType,
                    data: imageData.data
                  }
                });
              }
            }
          }
          contents.push({
            role: 'user',
            parts: parts
          });
        } else {
          contents.push({
            role: 'user',
            parts: [{ text: message.content }]
          });
        }
      } else if (message.role === 'assistant') {
        contents.push({
          role: 'model',
          parts: [{ text: message.content }]
        });
      }
    }
    
    return contents;
  }

  // 提取图片数据（从base64 URL）
  extractImageData(imageUrl) {
    try {
      if (imageUrl.startsWith('data:')) {
        const [header, data] = imageUrl.split(',');
        const mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/jpeg';
        return {
          mimeType: mimeType,
          data: data
        };
      }
      return null;
    } catch (error) {
      console.error('提取图片数据失败:', error);
      return null;
    }
  }

  // 发送包含文件的消息（Vision API）
  async sendMessageWithImage(messages, imageUrl, model = 'gemini-2.5-flash', options = {}) {
    this.checkInitialized();
    
    try {
      // 构建包含图片的消息
      const messageWithImage = {
        role: 'user',
        content: [
          {
            type: 'text',
            text: messages[messages.length - 1].content
          },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl
            }
          }
        ]
      };

      // 替换最后一条用户消息
      const updatedMessages = [...messages.slice(0, -1), messageWithImage];

      const response = await this.sendNonStreamMessage(updatedMessages, model, options);
      
      return response;
    } catch (error) {
      console.error('Google AI Vision API调用失败:', error);
      return {
        success: false,
        error: error.message || '发送图片消息失败'
      };
    }
  }

  // 获取可用模型列表
  async getModels() {
    this.checkInitialized();
    
    try {
      // Google AI SDK 目前不提供模型列表API，返回常用模型
      const models = [
        { id: 'gemini-2.5-flash', object: 'model', created: Date.now(), owned_by: 'google' },
        { id: 'gemini-1.5-pro', object: 'model', created: Date.now(), owned_by: 'google' },
        { id: 'gemini-1.5-flash', object: 'model', created: Date.now(), owned_by: 'google' },
        { id: 'gemini-1.0-pro', object: 'model', created: Date.now(), owned_by: 'google' }
      ];
      
      return {
        success: true,
        models: models
      };
    } catch (error) {
      console.error('获取模型列表失败:', error);
      return {
        success: false,
        error: error.message || '获取模型列表失败'
      };
    }
  }

  // 上传文件（Google AI 不支持文件上传，返回错误）
  async uploadFile(file, purpose = 'assistants') {
    return {
      success: false,
      error: 'Google AI SDK 不支持文件上传功能'
    };
  }

  // 获取文件信息（Google AI 不支持文件管理，返回错误）
  async getFileInfo(fileId) {
    return {
      success: false,
      error: 'Google AI SDK 不支持文件管理功能'
    };
  }

  // 删除文件（Google AI 不支持文件管理，返回错误）
  async deleteFile(fileId) {
    return {
      success: false,
      error: 'Google AI SDK 不支持文件管理功能'
    };
  }
}

// 创建单例实例
const googleaiService = new GoogleAIService();

export default googleaiService;