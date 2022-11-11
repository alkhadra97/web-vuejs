function getFormattedDate(date) {
  let oddDay;
  let currentDay = date.getDate();
  const countDay = String(Math.abs(currentDay)).length;
  if (countDay === 1) {
    oddDay = "0" + currentDay;
  } else {
    oddDay = currentDay;
  }
  let oddMonth;
  let currentMonth = date.getMonth() + 1;
  const count = String(Math.abs(currentMonth)).length;
  if (count === 1) {
    oddMonth = "0" + currentMonth;
  } else {
    oddMonth = currentMonth;
  }

  return `${date.getFullYear()}-${oddMonth}-${oddDay}`;
}
function dateHelper(howManyDay) {
  let dateOffset = 24 * 60 * 60 * 1000 * `${howManyDay}`;
  let myDate = new Date();
  myDate.setTime(myDate.getTime() - dateOffset);
  let beforeThirtyDays = myDate.toISOString().slice(0, 10);
  return beforeThirtyDays;
}
function dateHelper2(howManyDay) {
  let dateOffset = 24 * 60 * 60 * 1000 * `${howManyDay}`;
  let myDate = new Date();
  myDate.setTime(myDate.getTime() + dateOffset);
  let beforeThirtyDays = myDate.toISOString().slice(0, 10);
  return beforeThirtyDays;
}

function calculateHours(timeIn, timeOut) {
  let fromHours = `${timeIn}`.slice(0, 2); //10
  let fromMunites = `${timeIn}`.slice(3, 5) / 60;
  let finalFromInHours = parseFloat(fromHours) + parseFloat(fromMunites);
  let toHours = `${timeOut}`.slice(0, 2);
  let toMunites = `${timeOut}`.slice(3, 5) / 60;
  let finalToInHours = parseFloat(toHours) + parseFloat(toMunites);
  return (finalToInHours - finalFromInHours).toFixed(2);
}
module.exports = { getFormattedDate, dateHelper, calculateHours, dateHelper2 };
