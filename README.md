# License-Status-Page

Welcome to my take of creating a simple status page to show licenses and to when they expire. The application has been built using react and can be hosted within a docker container. 

### Darkmode Vs Lightmode comparison

![comparison](https://github.com/KieranJamess/License-Status-Page/blob/main/assets/DarkModevLightMode.png)

### Demo

![demo-gif](https://github.com/KieranJamess/License-Status-Page/blob/main/assets/demo.gif)

## Workflow

### LicenseChart

This is the code responsible for generating the bars 

1. Application reads data.json file for a list of licenses, with their start date and expiry date. 

2. We then work out the percentage left using the start date and expiry date. 

   ```javascript
     const today = new Date();
     const remainingPercentages = Object.keys(data).map((key) => {
       const startDate = new Date(data[key].startDate);
       const expireDate = new Date(data[key].expire);
       const totalTime = expireDate.getTime() - startDate.getTime();
       const remainingTime = expireDate.getTime() - today.getTime();
       const daysLeft = Math.ceil(remainingTime / (1000 * 3600 * 24));
       return { percentage: (remainingTime / totalTime) * 100, daysLeft };
     });
   ```

3. This is sorted to closest to expire -> last to expire.

   - If two licenses share the same time left, it will then sort in percentage left.

   ```javascript
   const sortedData = Object.entries(data).sort((a, b) => {
       const aDate = new Date(a[1].expire);
       const bDate = new Date(b[1].expire);
       if (aDate < bDate) return -1;
       if (aDate > bDate) return 1;
       const aPercentage = remainingPercentages[Object.keys(data).indexOf(a[0])].percentage;
       const bPercentage = remainingPercentages[Object.keys(data).indexOf(b[0])].percentage;
       return aPercentage - bPercentage;
     });
   ```

4. Using this data, we want to generate bars. We will create a bar for each license.

   - Get the remaining percentage for the key and work out how much of our bar will be filled (as we want to flip it)

   ```javascript
   const remainingPercentage = remainingPercentages[Object.keys(data).indexOf(key)].percentage;
   const barPercentage = 100 - remainingPercentage;
   ```

   - We want to have a dynamic colour grading for our bar, so 0% will be red, 100% will be green, but if the percent left if 8% we want to work out what 8% between red and green.

   ```javascript
   const hue = remainingPercentage / 100 * 110;
   const saturation = 100;
   const lightness = 50 - Math.abs(remainingPercentage - 50) / 50;
   const barColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
   ```

   - For each bar, we want to have a info box to show that can provide more information regarding the license. 

   ```javascript
   const infoBox = (
   	<div className="info-box">
   		<p>Start Date: {value.startDate}</p>
   		<p>{Math.round(barPercentage)}%</p>
   		<p>End Date: {value.expire}</p>
   	</div>
   );
   ```

5. Now we return in a simple way to display the bars when we want to use it.

   ```javascript
   return (
       <div className="license-chart">
         {bars}
       </div>
     );
   ```

### theme

This is the code responsible for controlling light mode or dark made, with also holding the users choice in a cookie.

1. We need a way for the user to control light mode or dark mode. We have a simple checkbox in HTML for this

   ```html
   <div class="slider-container">
       <span class="slider-text">Dark Mode</span>
       <label class="switch">
           <input type="checkbox" id="theme-toggle">
           <span class="slider"></span>
       </label>
   </div>
   ```

2. We want to capture when that checkbox is pressed, and when to activate the CSS classes using dark-mode. We also store the theme.

   ```javascript
   const themeToggle = document.getElementById('theme-toggle');
   
   themeToggle.addEventListener('change', () => {
     if (themeToggle.checked) {
       document.body.classList.add('dark-mode');
       localStorage.setItem('theme', 'dark');
     } else {
       document.body.classList.remove('dark-mode');
       localStorage.setItem('theme', 'light');
     }
   });
   ```

3. We want to check on page load if the theme has been stored

   ```javascript
   // On page load, check if a theme has been previously set and update the slider accordingly
   const savedTheme = localStorage.getItem('theme');
   
   if (savedTheme === 'dark') {
     document.body.classList.add('dark-mode');
     themeToggle.checked = true;
   } else {
     document.body.classList.remove('dark-mode');
     themeToggle.checked = false;
   }
   ```

## Future plans

### V1

- Create infrastructure to host application on a Kubernetes cluster
  - Have a configMap to replace the data.json file to live update the application

### V2

- Implement direct integration page for third party applications to get license information