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
}

module.exports = Formate