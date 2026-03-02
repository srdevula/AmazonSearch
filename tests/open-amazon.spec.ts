import { test, expect} from '@playwright/test';
import {HomePage} from '../pages/HomePage';

test('Open amazon.in', async ({ page }) => {
  const homePage = new HomePage(page);
  const url = 'https://www.amazon.in/';
  await homePage.goTo(url);
  await homePage.waitForPageLoad();
  await homePage.verifyPageTitle("Amazon.in");
  await homePage.selectSearchCategory('search-alias=furniture');
  await homePage.searchForProduct('Chairs for computer table');
  const highestPriceProductName = await homePage.getHighestPricedProductOnPage();
  console.log('Highest priced product on page:', highestPriceProductName);
  const fiveStarRatings = await homePage.getFiveStarRatingsForProduct();
  console.log('Number of 5-star ratings for the highest priced product:', fiveStarRatings);
});
