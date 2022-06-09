class Formate{
    formateToStr(list) {
        const string = "[" + list.toString() + "]";
        return string
    }

    formateMessage(data, image, username) {
        return {
            "sender": username,
            "receiver": data.receiver,
            "image": image,
            "message": data.message,
            "time": data.time
        }
    }

    formateRedisMessage(sender, receiver, message, time) {
        return {
            "sender": sender,
            "receiver": receiver,
            "message": message,
            "time": time
        }
    }
}

module.exports = Formate