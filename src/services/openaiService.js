import OpenAI from 'openai';

class OpenAIService {
  constructor() {
    this.client = null;
    this.isInitialized = false;
  }

  // 初始化OpenAI客户端
  initialize(apiKey, baseURL = null) {
    try {
      const config = {
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // 允许在浏览器中使用
      };
      
      if (baseURL) {
        config.baseURL = baseURL;
      }
      
      this.client = new OpenAI(config);
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('OpenAI客户端初始化失败:', error);
      this.isInitialized = false;
      return false;
    }
  }

  // 配置OpenAI客户端（与initialize方法相同，为了兼容性）
  configure(config) {
    return this.initialize(config.apiKey, config.baseURL);
  }

  // 检查是否已初始化
  checkInitialized() {
    if (!this.isInitialized || !this.client) {
      throw new Error('OpenAI客户端未初始化，请先调用initialize方法');
    }
  }

  // 发送消息（支持流式和非流式）
  async sendMessage(messages, options = {}) {
    this.checkInitialized();
    
    try {
      // 如果是流式请求
      if (options.stream) {
        const result = await this.sendStreamMessage(messages, options.model || 'gpt-3.5-turbo', options, options.onChunk);
        console.log('流式API调用结果:', result);
        return result;
      }
      
      // 非流式请求
      const response = await this.client.chat.completions.create({
        model: options.model || 'gpt-3.5-turbo',
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
        ...options
      });
      
      return {
        success: true,
        content: response.choices[0].message.content,
        usage: response.usage,
        model: response.model
      };
    } catch (error) {
      console.error('OpenAI API调用失败:', error);
      if (options.onError) {
        options.onError(error);
      }
      return {
        success: false,
        error: error.message || '发送消息失败'
      };
    }
  }

  // 发送流式消息
  async sendStreamMessage(messages, model = 'gpt-3.5-turbo', options = {}, onChunk = null) {
    this.checkInitialized();
    
    try {
      console.log('开始流式API调用:', { model, messages: messages.length, options });
      
      const stream = await this.client.chat.completions.create({
        model: model,
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
        stream: true,
        ...options
      });

      console.log('流式API调用成功，开始处理响应');
      let fullContent = '';
      let chunkCount = 0;
      
      for await (const chunk of stream) {
        chunkCount++;
        console.log(`处理第${chunkCount}个chunk:`, chunk);
        
        // 检查chunk结构
        if (chunk.choices && chunk.choices[0]) {
          const delta = chunk.choices[0].delta;
          const content = delta?.content || '';
          
          if (content) {
            fullContent += content;
            console.log('收到内容:', content, '累计内容长度:', fullContent.length);
            
            if (onChunk || options.onChunk) {
              const callback = onChunk || options.onChunk;
              try {
                callback(fullContent); // 传递完整内容而不是增量内容
              } catch (callbackError) {
                console.error('回调函数执行错误:', callbackError);
              }
            }
          }
          
          // 检查是否是结束标记
          if (chunk.choices[0].finish_reason) {
            console.log('收到结束标记:', chunk.choices[0].finish_reason);
          }
        } else {
          console.log('收到无效chunk结构:', chunk);
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
      console.error('OpenAI流式API调用失败:', error);
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

  // 上传文件到OpenAI
  async uploadFile(file, purpose = 'assistants') {
    this.checkInitialized();
    
    try {
      const response = await this.client.files.create({
        file: file,
        purpose: purpose
      });
      
      return {
        success: true,
        fileId: response.id,
        filename: response.filename,
        bytes: response.bytes,
        purpose: response.purpose
      };
    } catch (error) {
      console.error('文件上传失败:', error);
      return {
        success: false,
        error: error.message || '文件上传失败'
      };
    }
  }

  // 获取文件信息
  async getFileInfo(fileId) {
    this.checkInitialized();
    
    try {
      const response = await this.client.files.retrieve(fileId);
      return {
        success: true,
        file: response
      };
    } catch (error) {
      console.error('获取文件信息失败:', error);
      return {
        success: false,
        error: error.message || '获取文件信息失败'
      };
    }
  }

  // 删除文件
  async deleteFile(fileId) {
    this.checkInitialized();
    
    try {
      const response = await this.client.files.del(fileId);
      return {
        success: true,
        deleted: response.deleted
      };
    } catch (error) {
      console.error('删除文件失败:', error);
      return {
        success: false,
        error: error.message || '删除文件失败'
      };
    }
  }

  // 发送包含文件的消息（Vision API）
  async sendMessageWithImage(messages, imageUrl, model = 'gpt-4-vision-preview', options = {}) {
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

      const response = await this.client.chat.completions.create({
        model: model,
        messages: updatedMessages,
        max_tokens: options.max_tokens || 1000,
        ...options
      });
      
      return {
        success: true,
        content: response.choices[0].message.content,
        usage: response.usage,
        model: response.model
      };
    } catch (error) {
      console.error('OpenAI Vision API调用失败:', error);
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
      const response = await this.client.models.list();
      return {
        success: true,
        models: response.data
      };
    } catch (error) {
      console.error('获取模型列表失败:', error);
      return {
        success: false,
        error: error.message || '获取模型列表失败'
      };
    }
  }
}

// 创建单例实例
const openaiService = new OpenAIService();

export default openaiService;