import { test, expect } from '@playwright/test'

test.describe('Horse Racing Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Initial State', () => {
    test('should display the app title', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Horse Racing')
    })

    test('should display Generate Program button', async ({ page }) => {
      await expect(page.locator('button:has-text("GENERATE PROGRAM")')).toBeVisible()
    })

    test('should display Start button', async ({ page }) => {
      await expect(page.locator('button:has-text("START")')).toBeVisible()
    })

    test('should have Start button disabled initially', async ({ page }) => {
      await expect(page.locator('button:has-text("START")')).toBeDisabled()
    })

    test('should display empty horse list message', async ({ page }) => {
      await expect(page.locator('text=Horse List (1-0)')).toBeVisible()
    })

    test('should display empty program message', async ({ page }) => {
      await expect(page.locator('text=Click "Generate Program" to create a race schedule')).toBeVisible()
    })

    test('should display empty results message', async ({ page }) => {
      await expect(page.locator('text=Results will appear here after each race')).toBeVisible()
    })
  })

  test.describe('Generate Program', () => {
    test('should generate horses when clicking Generate Program', async ({ page }) => {
      await page.locator('button:has-text("GENERATE PROGRAM")').click()
      
      await expect(page.locator('text=Horse List (1-20)')).toBeVisible()
    })

    test('should populate horse list table', async ({ page }) => {
      await page.locator('button:has-text("GENERATE PROGRAM")').click()
      
      await expect(page.locator('text=Horse List (1-20)')).toBeVisible()
      
      const rows = page.locator('.bg-white').first().locator('tbody tr')
      await expect(rows).toHaveCount(20)
    })

    test('should generate race schedule with 6 rounds', async ({ page }) => {
      await page.locator('button:has-text("GENERATE PROGRAM")').click()
      
      await expect(page.locator('text=Horse List (1-20)')).toBeVisible()
      
      await expect(page.locator('text=1st Lap - 1200m').first()).toBeVisible()
      await expect(page.locator('text=2nd Lap - 1400m').first()).toBeVisible()
      await expect(page.locator('text=3rd Lap - 1600m').first()).toBeVisible()
      await expect(page.locator('text=4th Lap - 1800m').first()).toBeVisible()
      await expect(page.locator('text=5th Lap - 2000m').first()).toBeVisible()
      await expect(page.locator('text=6th Lap - 2200m').first()).toBeVisible()
    })

    test('should enable Start button after generating', async ({ page }) => {
      await page.locator('button:has-text("GENERATE PROGRAM")').click()
      
      await expect(page.locator('text=Horse List (1-20)')).toBeVisible()
      
      await expect(page.locator('button:has-text("START")')).toBeEnabled()
    })

    test('should display horses on race track', async ({ page }) => {
      await page.locator('button:has-text("GENERATE PROGRAM")').click()
      
      await expect(page.locator('text=Horse List (1-20)')).toBeVisible()
      
      const lanes = page.locator('.bg-green-600')
      await expect(lanes).toHaveCount(10)
    })
  })

  test.describe('Race Controls', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('button:has-text("GENERATE PROGRAM")').click()
      await expect(page.locator('text=Horse List (1-20)')).toBeVisible()
    })

    test('should show PAUSE button when race starts', async ({ page }) => {
      await page.locator('button:has-text("START")').click()
      
      await expect(page.locator('button:has-text("PAUSE")')).toBeVisible()
    })

    test('should show Racing indicator when race is in progress', async ({ page }) => {
      await page.locator('button:has-text("START")').click()
      
      await expect(page.locator('text=Racing...')).toBeVisible()
    })

    test('should disable Generate Program during race', async ({ page }) => {
      await page.locator('button:has-text("START")').click()
      
      await expect(page.locator('button:has-text("GENERATE PROGRAM")')).toBeDisabled()
    })

    test('should show RESUME button when paused', async ({ page }) => {
      await page.locator('button:has-text("START")').click()
      await page.locator('button:has-text("PAUSE")').click()
      
      await expect(page.locator('button:has-text("RESUME")')).toBeVisible()
    })
  })

  test.describe('Visual Elements', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('button:has-text("GENERATE PROGRAM")').click()
      await expect(page.locator('text=Horse List (1-20)')).toBeVisible()
    })

    test('should have colored lane numbers', async ({ page }) => {
      const lane1 = page.locator('text=1').first()
      await expect(lane1).toBeVisible()
    })

    test('should display horse icons on track', async ({ page }) => {
      const horses = page.locator('svg[viewBox="0 0 100 100"]')
      await expect(horses).toHaveCount(10)
    })

    test('should show finish line', async ({ page }) => {
      await expect(page.locator('text=FINISH')).toBeVisible()
    })

    test('should show current lap indicator', async ({ page }) => {
      await expect(page.locator('text=1st Lap - 1200m').first()).toBeVisible()
    })
  })

  test.describe('Notifications', () => {
    test('should show success notification after generating program', async ({ page }) => {
      await page.locator('button:has-text("GENERATE PROGRAM")').click()
      
      await expect(page.locator('text=Horse List (1-20)')).toBeVisible()
      
      await expect(page.locator('text=Race program generated successfully!')).toBeVisible()
    })
  })
})
