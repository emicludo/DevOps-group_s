const convert = (epoch) => {
  const date = new Date(epoch);
  const formatted = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate()) + ' @ ' + date.getHours() + ':' + date.getMinutes();
  return formatted;
}

module.exports = convert;