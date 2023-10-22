export const profileStatistics = (visits, score, books) => `
<div class="profile_stat">
  <div>Visits</div>
  <img src="./assets/icons/union.svg" />
  <div class="profile_score">${visits}</div>
</div>
<div class="profile_stat">
  <div>Bonuses</div>
  <img src="./assets/icons/star.svg" />
  <div class="profile_score">${score}</div>
</div>
<div class="profile_stat">
  <div>Books</div>
  <img src="./assets/icons/book.svg" />
  <div class="profile_score">${books}</div>
</div>`
