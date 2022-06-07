class Response{
    getSuccess() {
        const response = {"success": true};
        return response
    }

    getResponseSuccess(data) {
        const response = {
            "success": true,
            "data": data
        };
        return response
    }

    getOthereSuccess(img, data) {
        const response = {
            "success": true,
            "people": img,
            "data": data
        };
        return response
    }

    getError(message) {
        const response = {
            "success": false,
            "message": message
        };
        return response
    }

    getServerError(){
        const response = {
            "success": false,
            "message": "error message from server"
        };
        return response
    }
};

module.exports = Response;