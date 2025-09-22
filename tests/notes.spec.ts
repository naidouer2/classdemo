import { test, expect } from '@playwright/test';

test.describe('记事本功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/notes');
    await page.waitForLoadState('networkidle');
  });

  test('页面正常加载', async ({ page }) => {
    await expect(page).toHaveTitle(/AI/);
    await expect(page.locator('h1')).toContainText('AI');
  });

  test('侧边栏导航正常', async ({ page }) => {
    const sidebar = page.locator('[data-testid="sidebar"]');
    await expect(sidebar).toBeVisible();
    
    const navItems = sidebar.locator('a');
    await expect(navItems).toHaveCount(4); // 记事本、待办、AI对话、番茄钟
    
    const activeItem = sidebar.locator('a.bg-blue-100');
    await expect(activeItem).toContainText('记事本');
  });

  test('创建新笔记', async ({ page }) => {
    const newButton = page.locator('button:has-text("新建笔记")');
    await expect(newButton).toBeVisible();
    
    await newButton.click();
    
    const editor = page.locator('[data-testid="editor"]');
    await expect(editor).toBeVisible();
    
    const titleInput = editor.locator('input[type="text"], textarea').first();
    await titleInput.fill('测试笔记标题');
    
    const contentArea = page.locator('textarea[placeholder*="内容"], [contenteditable="true"]');
    await contentArea.fill('这是测试笔记的内容');
    
    await page.waitForTimeout(1000); // 等待自动保存
    
    const noteList = page.locator('[data-testid="note-list"]');
    await expect(noteList).toContainText('测试笔记标题');
  });

  test('编辑现有笔记', async ({ page }) => {
    const noteList = page.locator('[data-testid="note-list"]');
    const firstNote = noteList.locator('div').first();
    
    if (await firstNote.count() > 0) {
      await firstNote.click();
      
      const editor = page.locator('[data-testid="editor"]');
      await expect(editor).toBeVisible();
      
      const contentArea = page.locator('textarea[placeholder*="内容"], [contenteditable="true"]');
      await contentArea.fill('编辑后的内容 ' + Date.now());
      
      await page.waitForTimeout(1000); // 等待自动保存
      
      await expect(page.locator('text=编辑后的内容')).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('AI润色功能', async ({ page }) => {
    const polishButton = page.locator('button:has-text("润色")');
    
    if (await polishButton.count() > 0) {
      await polishButton.click();
      
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
      
      const originalText = modal.locator('text=原文');
      const polishedText = modal.locator('text=润色后');
      
      await expect(originalText).toBeVisible();
      await expect(polishedText).toBeVisible();
      
      const applyButton = modal.locator('button:has-text("应用")');
      await expect(applyButton).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('标签功能', async ({ page }) => {
    const tagInput = page.locator('input[placeholder*="标签"]');
    
    if (await tagInput.count() > 0) {
      await tagInput.fill('测试标签');
      await tagInput.press('Enter');
      
      const tagElement = page.locator('span:has-text("测试标签")');
      await expect(tagElement).toBeVisible();
    } else {
      test.skip();
    }
  });
});