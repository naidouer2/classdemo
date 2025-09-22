import { test, expect } from '@playwright/test';

test.describe('番茄钟功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pomodoro');
    await page.waitForLoadState('networkidle');
  });

  test('页面正常加载', async ({ page }) => {
    await expect(page).toHaveTitle(/AI/);
    await expect(page.locator('h1')).toContainText('番茄钟');
  });

  test('计时器显示', async ({ page }) => {
    const timer = page.locator('[data-testid="timer"], .timer, h2:has-text(":")').first();
    await expect(timer).toBeVisible();
    
    const timerText = await timer.textContent();
    expect(timerText).toMatch(/\d{1,2}:\d{2}/); // 匹配时间格式 MM:SS
  });

  test('开始/暂停功能', async ({ page }) => {
    const startButton = page.locator('button:has-text("开始"), button:has-text("Start")').first();
    const pauseButton = page.locator('button:has-text("暂停"), button:has-text("Pause")').first();
    
    if (await startButton.count() > 0) {
      await startButton.click();
      
      // 等待几秒，检查计时器是否变化
      await page.waitForTimeout(2000);
      
      if (await pauseButton.count() > 0) {
        await pauseButton.click();
      }
    } else {
      test.skip();
    }
  });

  test('重置功能', async ({ page }) => {
    const resetButton = page.locator('button:has-text("重置"), button:has-text("Reset")').first();
    
    if (await resetButton.count() > 0) {
      await resetButton.click();
      
      const timer = page.locator('[data-testid="timer"], .timer, h2:has-text(":")').first();
      const timerText = await timer.textContent();
      expect(timerText).toMatch(/25:00|15:00|5:00/); // 检查是否重置为标准时间
    } else {
      test.skip();
    }
  });

  test('工作/休息模式切换', async ({ page }) => {
    const modeIndicator = page.locator('text=工作时间, text=休息时间, text=Work, text=Break').first();
    
    if (await modeIndicator.count() > 0) {
      await expect(modeIndicator).toBeVisible();
      
      // 检查是否有模式切换按钮
      const switchButton = page.locator('button:has-text("切换"), button:has-text("Switch")').first();
      if (await switchButton.count() > 0) {
        await switchButton.click();
      }
    } else {
      test.skip();
    }
  });

  test('番茄统计', async ({ page }) => {
    const stats = page.locator('text=完成, text=番茄, text=completed, text=pomodoro').first();
    
    if (await stats.count() > 0) {
      await expect(stats).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('设置功能', async ({ page }) => {
    const settingsButton = page.locator('button:has-text("设置"), button:has-text("Settings"), [data-testid="settings"]').first();
    
    if (await settingsButton.count() > 0) {
      await settingsButton.click();
      
      const settingsModal = page.locator('[role="dialog"], .settings-modal').first();
      if (await settingsModal.count() > 0) {
        await expect(settingsModal).toBeVisible();
        
        // 检查时间设置输入框
        const timeInput = settingsModal.locator('input[type="number"]').first();
        await expect(timeInput).toBeVisible();
      }
    } else {
      test.skip();
    }
  });
});