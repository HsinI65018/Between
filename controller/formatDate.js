function formatMessage(data, image, username) {
  return {
    'sender': username,
    'receiver': data.receiver,
    'image': image,
    'message': data.message,
    'time': data.time
  };
}
//'time':  moment().format('h:mm a')

module.exports = formatMessage;