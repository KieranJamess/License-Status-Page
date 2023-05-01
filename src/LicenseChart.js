import React, { useEffect } from 'react';

const LicenseChart = ({ data }) => {
  const today = new Date();
  const remainingPercentages = Object.keys(data).map((key) => {
    const startDate = new Date(data[key].startDate);
    const expireDate = new Date(data[key].expire);
    const totalTime = expireDate.getTime() - startDate.getTime();
    const remainingTime = expireDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(remainingTime / (1000 * 3600 * 24));
    return { percentage: (remainingTime / totalTime) * 100, daysLeft };
  });

  const sortedData = Object.entries(data).sort((a, b) => {
    const aDate = new Date(a[1].expire);
    const bDate = new Date(b[1].expire);
    if (aDate < bDate) return -1;
    if (aDate > bDate) return 1;
    const aPercentage = remainingPercentages[Object.keys(data).indexOf(a[0])].percentage;
    const bPercentage = remainingPercentages[Object.keys(data).indexOf(b[0])].percentage;
    return aPercentage - bPercentage;
  });
  
  const bars = sortedData.map(([key, value], index) => {
    const remainingPercentage = remainingPercentages[Object.keys(data).indexOf(key)].percentage;
    const barPercentage = 100 - remainingPercentage;
    const daysLeft = remainingPercentages[Object.keys(data).indexOf(key)].daysLeft;
    const hue = remainingPercentage / 100 * 110;
    const saturation = 100;
    const lightness = 50 - Math.abs(remainingPercentage - 50) / 50;
    const barColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const barRadius = 3;
    const infoBox = (
      <div className="info-box">
        <p>Start Date: {value.startDate}</p>
        <p>{Math.round(barPercentage)}%</p>
        <p>End Date: {value.expire}</p>
      </div>
    );
    return (
      <div key={key} className="license-box fadeIn" style={{ borderRadius: barRadius, animationDelay: `${100 * index}ms` }}>
        <div className="license-bar" style={{ backgroundColor: barColor, width: `${barPercentage}%`, borderRadius: barRadius }} />
        <div className="license-info">
          <p>{key}</p>
          <div style={{ textAlign: 'right' }}>
          <p>{daysLeft} Days</p>
          </div>
        </div>
        {infoBox}
      </div>
    );
  }); 

  useEffect(() => {
    const licenseBoxes = document.querySelectorAll('.license-box');
    licenseBoxes.forEach((box, index) => {
      setTimeout(() => {
        box.classList.add('fade');
      }, 100 * index);
    });
  }, []);

  return (
    <div className="license-chart">
      {bars}
    </div>
  );
};

export default LicenseChart;
