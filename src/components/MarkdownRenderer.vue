<template>
  <div class="markdown-content" ref="contentRef"></div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick, watch } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import katex from 'katex'

// 导入样式
import 'highlight.js/styles/github.css'
import 'katex/dist/katex.min.css'

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

const contentRef = ref(null)

// 配置marked选项
const renderer = new marked.Renderer()

// 自定义代码块渲染器
renderer.code = function(code, language) {
  // 确保code是字符串类型
  const codeString = String(code || '')
  const languageString = String(language || '')
  
  const validLanguage = hljs.getLanguage(languageString) ? languageString : 'plaintext'
  
  let highlighted
  try {
    highlighted = hljs.highlight(codeString, { language: validLanguage }).value
  } catch (error) {
    console.warn('代码高亮失败:', error)
    highlighted = codeString // 如果高亮失败，使用原始代码
  }
  
  return `
    <div class="code-block-container">
      <div class="code-block-header">
        <span class="code-language">${languageString || 'text'}</span>
        <button class="copy-button" onclick="copyCode(this)" title="复制代码">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="m5 15-4-4 4-4"></path>
          </svg>
          复制
        </button>
      </div>
      <pre><code class="hljs language-${validLanguage}">${highlighted}</code></pre>
      <textarea class="code-content" style="display: none;">${codeString}</textarea>
    </div>
  `
}

// 自定义行内代码渲染器
renderer.codespan = function(code) {
  // 确保code是字符串类型
  const codeString = String(code || '')
  return `<code class="inline-code">${codeString}</code>`
}

marked.setOptions({
  renderer: renderer,
  breaks: true,
  gfm: true,
  sanitize: false,
})

// 处理LaTeX数学公式
const processLatex = (content) => {
  // 确保content是字符串类型
  const contentString = String(content || '')
  
  // 先处理块级数学公式 $$...$$（包括多行）
  let result = contentString.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
    try {
      const formulaString = String(formula || '').trim()
      const rendered = katex.renderToString(formulaString, { 
        displayMode: true,
        throwOnError: false,
        strict: false
      })
      return `<div class="katex-display">${rendered}</div>`
    } catch (error) {
      console.error('LaTeX块级公式渲染错误:', error, '公式:', formula)
      return `<div class="latex-error">LaTeX渲染错误: ${match}</div>`
    }
  })
  
  // 再处理行内数学公式 $...$（避免与块级公式冲突）
  result = result.replace(/(?<!\$)\$([^$\n]+?)\$(?!\$)/g, (match, formula) => {
    try {
      const formulaString = String(formula || '').trim()
      const rendered = katex.renderToString(formulaString, { 
        displayMode: false,
        throwOnError: false,
        strict: false
      })
      return `<span class="katex-inline">${rendered}</span>`
    } catch (error) {
      console.error('LaTeX行内公式渲染错误:', error, '公式:', formula)
      return `<span class="latex-error">LaTeX渲染错误: ${match}</span>`
    }
  })
  
  return result
}

const renderedContent = computed(() => {
  if (!props.content) return ''
  
  try {
    // 确保content是字符串类型
    const contentString = String(props.content || '')
    
    // 先处理LaTeX公式，再处理Markdown
    let processedContent = processLatex(contentString)
    let html = marked(processedContent)
    
    return html
  } catch (error) {
    console.error('Markdown渲染错误:', error)
    return String(props.content || '')
  }
})

// 添加全局复制函数
const addCopyFunction = () => {
  if (typeof window !== 'undefined') {
    window.copyCode = function(button) {
      const container = button.closest('.code-block-container')
      const textarea = container.querySelector('.code-content')
      const code = textarea.value
      
      navigator.clipboard.writeText(code).then(() => {
        const originalText = button.innerHTML
        button.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
          已复制
        `
        button.style.color = '#10b981'
        
        setTimeout(() => {
          button.innerHTML = originalText
          button.style.color = ''
        }, 2000)
      }).catch(err => {
        console.error('复制失败:', err)
      })
    }
  }
}

// 更新DOM内容
const updateContent = async () => {
  if (contentRef.value) {
    contentRef.value.innerHTML = renderedContent.value
    await nextTick()
    addCopyFunction()
  }
}

watch(() => props.content, updateContent)

onMounted(() => {
  updateContent()
})
</script>

<style scoped>
.markdown-content {
  line-height: 1.6;
  word-wrap: break-word;
}

/* Markdown样式 */
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin: 0.5em 0;
  font-weight: 600;
}

.markdown-content :deep(h1) { font-size: 1.5em; }
.markdown-content :deep(h2) { font-size: 1.3em; }
.markdown-content :deep(h3) { font-size: 1.1em; }

.markdown-content :deep(p) {
  margin: 0.5em 0;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.markdown-content :deep(li) {
  margin: 0.2em 0;
}

/* 行内代码样式 */
.markdown-content :deep(.inline-code) {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-family: 'Fira Code', 'Courier New', Courier, monospace;
  font-size: 0.9em;
  color: #e11d48;
}

/* 代码块容器样式 */
.markdown-content :deep(.code-block-container) {
  margin: 0.5em 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #f8f9fa;
}

/* 代码块头部样式 */
.markdown-content :deep(.code-block-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em 1em;
  background-color: #e9ecef;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.markdown-content :deep(.code-language) {
  font-size: 0.8em;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
}

/* 复制按钮样式 */
.markdown-content :deep(.copy-button) {
  display: flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.3em 0.6em;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.8em;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;
}

.markdown-content :deep(.copy-button:hover) {
  background-color: #f8f9fa;
  border-color: #adb5bd;
  color: #495057;
}

.markdown-content :deep(.copy-button:active) {
  transform: translateY(1px);
}

/* 代码块样式 */
.markdown-content :deep(pre) {
  margin: 0;
  padding: 1em;
  background-color: #f8f9fa;
  overflow-x: auto;
  font-family: 'Fira Code', 'Courier New', Courier, monospace;
  font-size: 0.9em;
  line-height: 1.4;
}

.markdown-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  color: inherit;
}

/* LaTeX数学公式样式 */
.markdown-content :deep(.katex) {
  font-size: 1.1em;
}

.markdown-content :deep(.katex-display) {
  margin: 1em 0;
  text-align: center;
  overflow-x: auto;
}

.markdown-content :deep(.katex-inline) {
  display: inline;
}

/* LaTeX错误样式 */
.markdown-content :deep(.latex-error) {
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  padding: 0.5em;
  margin: 0.5em 0;
  color: #c33;
  font-family: monospace;
  font-size: 0.9em;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid #ddd;
  margin: 0.5em 0;
  padding-left: 1em;
  color: #666;
}

.markdown-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 0.5em 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid #ddd;
  padding: 0.5em;
  text-align: left;
}

.markdown-content :deep(th) {
  background-color: rgba(0, 0, 0, 0.05);
  font-weight: 600;
}

.markdown-content :deep(a) {
  color: #0066cc;
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.markdown-content :deep(strong) {
  font-weight: 600;
}

.markdown-content :deep(em) {
  font-style: italic;
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .markdown-content :deep(.inline-code) {
    background-color: rgba(255, 255, 255, 0.1);
    color: #f472b6;
  }
  
  .markdown-content :deep(.code-block-container) {
    background-color: #1f2937;
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .markdown-content :deep(.code-block-header) {
    background-color: #374151;
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .markdown-content :deep(.code-language) {
    color: #9ca3af;
  }
  
  .markdown-content :deep(.copy-button) {
    background-color: #374151;
    border-color: #4b5563;
    color: #d1d5db;
  }
  
  .markdown-content :deep(.copy-button:hover) {
    background-color: #4b5563;
    border-color: #6b7280;
    color: #f3f4f6;
  }
  
  .markdown-content :deep(pre) {
    background-color: #1f2937;
  }
}
</style>