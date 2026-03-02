import { Page, Locator, expect } from '@playwright/test'

export class HomePage {
  page: Page;
  pageTitle: Locator;
  searchDropdown: Locator;
  inputSearch: Locator;
  searchButton: Locator;
  continueShoppingButton: Locator;

  constructor(page: Page) {

    this.page = page;
    this.pageTitle = page.locator('title').first();
    this.searchDropdown = page.locator('#searchDropdownBox');
    this.inputSearch = page.locator('#twotabsearchtextbox');
    this.searchButton = page.locator('#nav-search-submit-button');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue shopping' });

  }

  async goTo(url: string) {
    await this.page.goto(url);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    const buttonLocator = this.continueShoppingButton;

    if (await buttonLocator.count() > 0) {
      if (await buttonLocator.isVisible()) {
        await buttonLocator.click();
      } else {
        await buttonLocator.waitFor({ state: 'visible' });
        await buttonLocator.click();
      }
    }
    else {
    await this.page.locator('#nav-logo-sprites').waitFor({ state: 'visible' });
    }
  }
  async verifyPageTitle(expectedTitle: string) {
    expect(await this.pageTitle.textContent()).toContain(expectedTitle);
  }

  async selectSearchCategory(category: string) {
    await this.searchDropdown.selectOption(category);
  }

  async searchForProduct(searchText: string) {
    await this.inputSearch.fill(searchText);
    await this.searchButton.click();
  }

  async getHighestPricedProductOnPage() {
    await this.page.waitForSelector('[data-component-type="s-search-result"]');
    const productResultCount = await this.page.locator('div[cel_widget_id*="MAIN-SEARCH_RESULTS"] > span > div').count();
    let highestPrice = 0;
    let highestPriceChairName = '';
    for (let i = 0; i < productResultCount; i++) {
      const priceText = await this.page.locator(`div[cel_widget_id*="MAIN-SEARCH_RESULTS"] > span > div > div.a-section span.a-price-whole`).nth(i).textContent();
      const chairName = await this.page.locator('div[cel_widget_id*="MAIN-SEARCH_RESULTS"] > span > div > div.a-section h2 span').nth(i).textContent();

      if (priceText) {
        const price = parseFloat(priceText.replace(/,/g, ''));
        if (price > highestPrice) {
          highestPrice = price;
          if (chairName) {
            highestPriceChairName = chairName.trim();
          }
        }
      }
    }
    return highestPriceChairName;
  }


  async getFiveStarRatingsForProduct() {
    await this.page.waitForSelector('[data-component-type="s-search-result"]');
    const productResultCount = await this.page.locator('div[cel_widget_id*="MAIN-SEARCH_RESULTS"] > span > div').count();
    let highestPrice = 0;
    let productIndexWithHighestPrice = 0;
    for (let i = 0; i < productResultCount; i++) {
      const priceText = await this.page.locator(`div[cel_widget_id*="MAIN-SEARCH_RESULTS"] > span > div > div.a-section span.a-price-whole`).nth(i).textContent();
      if (priceText) {
        const price = parseFloat(priceText.replace(/,/g, ''));
        if (price > highestPrice) {
          highestPrice = price;
          productIndexWithHighestPrice = i;

        }
      }
    }
    const ratingsPopup = this.page.locator(`div[cel_widget_id*="MAIN-SEARCH_RESULTS"] > span > div > div.a-section i.a-icon-popover`).nth(productIndexWithHighestPrice);
    await ratingsPopup.hover();
    await ratingsPopup.click();
    const fiveStarRatingText = await this.page.locator('a[data-reviews-state-param*="five_star"] div.a-text-right span').first().textContent();
    const totalRatingsText = await this.page.locator('span[data-hook="total-review-count"]').textContent();
    const totalRatings = totalRatingsText ? parseInt(totalRatingsText.replace(/,/g, '')) : 0;
    const fiveStarRatingPercent = fiveStarRatingText ? parseFloat(fiveStarRatingText.replace('%', '')) : 0;
    const fiveStarRatingsCount = Math.floor(fiveStarRatingPercent * totalRatings / 100);
    return fiveStarRatingsCount;
  }



}



