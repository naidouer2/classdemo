import { test, expect } from '@playwright/test';

test.describe('Todo List Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/todo');
    await page.waitForLoadState('networkidle');
  });

  test('Page loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/AI/);
    await expect(page.locator('h1')).toContainText('待办');
  });

  test('Add new todo item', async ({ page }) => {
    const input = page.locator('input[placeholder*="待办"], input[placeholder*="todo"], input[type="text"]').first();
    await expect(input).toBeVisible();
    
    await input.fill('Test todo item');
    await input.press('Enter');
    
    const todoItem = page.locator('text=Test todo item');
    await expect(todoItem).toBeVisible();
  });

  test('Complete todo item', async ({ page }) => {
    const input = page.locator('input[placeholder*="待办"], input[placeholder*="todo"], input[type="text"]').first();
    await input.fill('Test todo to complete');
    await input.press('Enter');
    
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.click();
    
    const completedItem = page.locator('text=Test todo to complete').locator('..');
    await expect(completedItem).toHaveClass(/completed|line-through/);
  });

  test('Delete todo item', async ({ page }) => {
    const input = page.locator('input[placeholder*="待办"], input[placeholder*="todo"], input[type="text"]').first();
    await input.fill('Test todo to delete');
    await input.press('Enter');
    
    const deleteButton = page.locator('button:has-text("删除"), button:has-text("Delete"), button:has-text("×")').first();
    await deleteButton.click();
    
    await expect(page.locator('text=Test todo to delete')).not.toBeVisible();
  });

  test('Filter todo items', async ({ page }) => {
    const filterButtons = page.locator('button:has-text("全部"), button:has-text("Active"), button:has-text("Completed")');
    
    if (await filterButtons.count() > 0) {
      await filterButtons.first().click();
      await expect(filterButtons.first()).toHaveClass(/active|selected/);
    } else {
      test.skip();
    }
  });

  test('Todo categories/projects', async ({ page }) => {
    const categorySelector = page.locator('select, button:has-text("分类"), button:has-text("项目")');
    
    if (await categorySelector.count() > 0) {
      await categorySelector.click();
      
      const options = page.locator('option, [role="option"]');
      if (await options.count() > 0) {
        await options.first().click();
      }
    } else {
      test.skip();
    }
  });
});