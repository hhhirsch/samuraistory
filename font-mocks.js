// Mocked Google Font responses for build environments without internet access.
// Remove this file and the NEXT_FONT_GOOGLE_MOCKED_RESPONSES env var when building
// in an environment with internet access to get self-hosted fonts.
module.exports = {
  "https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&display=swap": `
@font-face {
  font-family: 'Cinzel';
  font-style: normal;
  font-weight: 400 900;
  font-display: swap;
  src: local('Cinzel'), local('serif');
}`,
  "https://fonts.googleapis.com/css2?family=Lora:wght@400..700&display=swap": `
@font-face {
  font-family: 'Lora';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: local('Lora'), local('Georgia'), local('serif');
}`,
};
