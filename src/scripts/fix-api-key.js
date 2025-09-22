// 检查并修复 API 密钥问题
function checkAndFixApiKey() {
  // 清除旧的 API 密钥
  localStorage.removeItem('kimi_api_key');
  
  // 设置新的 OpenRouter API 密钥
  const apiKey = localStorage.getItem('openrouter_api_key');
  console.log('当前 OpenRouter API 密钥:', apiKey);
  
  if (!apiKey) {
    console.error('未找到 OpenRouter API 密钥');
    return;
  }
  
  // 触发更新事件
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('apiKeyUpdated'));
  console.log('已触发 API 密钥更新事件');
  
  // 测试 API 连接
  fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'U2记事本'
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-chat-v3.1',
      messages: [{ role: 'user', content: '测试连接' }],
      max_tokens: 10
    })
  })
  .then(response => {
    if (response.ok) {
      console.log('API 连接测试成功');
    } else {
      console.error('API 连接测试失败:', response.status, response.statusText);
    }
  })
  .catch(error => {
    console.error('API 连接测试出错:', error);
  });
}

// 执行检查和修复
checkAndFixApiKey();