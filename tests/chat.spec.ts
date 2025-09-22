import { test, expect } from '@playwright/test';

test.describe('AI对话功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');
  });

  test('页面正常加载', async ({ page }) => {
    await expect(page).toHaveTitle(/AI/);
    await expect(page.locator('h1')).toContainText('AI对话');
  });

  test('发送消息', async ({ page }) => {
    const input = page.locator('input[placeholder*="输入消息"], textarea[placeholder*="输入消息"], input[type="text"]').first();
    await expect(input).toBeVisible();
    
    await input.fill('你好，这是一个测试消息');
    await input.press('Enter');
    
    const userMessage = page.locator('text=你好，这是一个测试消息');
    await expect(userMessage).toBeVisible();
  });

  test('AI回复', async ({ page }) => {
    const input = page.locator('input[placeholder*="输入消息"], textarea[placeholder*="输入消息"], input[type="text"]').first();
    await input.fill('你好');
    await input.press('Enter');
    
    // 等待AI回复
    await page.waitForTimeout(3000);
    
    const messages = page.locator('[data-testid="message"], .message, .chat-message');
    const messageCount = await messages.count();
    expect(messageCount).toBeGreaterThanOrEqual(2); // 用户消息 + AI回复
  });

  test('清除聊天记录', async ({ page }) => {
    const clearButton = page.locator('button:has-text("清除"), button:has-text("清空")');
    
    if (await clearButton.count() > 0) {
      await clearButton.click();
      
      const messages = page.locator('[data-testid="message"], .message, .chat-message');
      await expect(messages).toHaveCount(0);
    } else {
      test.skip();
    }
  });

  test('模型选择', async ({ page }) => {
    const modelSelector = page.locator('select, button:has-text("模型"), button:has-text("Model")');
    
    if (await modelSelector.count() > 0) {
      await modelSelector.click();
      
      const options = page.locator('option, [role="option"]');
      if (await options.count() > 0) {
        await options.first().click();
      }
    } else {
      test.skip();
    }
  });

  test('消息历史', async ({ page }) => {
    const input = page.locator('input[placeholder*="输入消息"], textarea[placeholder*="输入消息"], input[type="text"]').first();
    
    // 发送多条消息
    for (let i = 0; i < 3; i++) {
      await input.fill(`测试消息 ${i + 1}`);
      await input.press('Enter');
      await page.waitForTimeout(1000);
    }
    
    const messages = page.locator('[data-testid="message"], .message, .chat-message');
    const messageCount = await messages.count();
    expect(messageCount).toBeGreaterThanOrEqual(3);
  });
});