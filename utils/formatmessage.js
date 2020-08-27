const moment = require('moment');

function formatMesaage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}
module.exports = formatMesaage;
