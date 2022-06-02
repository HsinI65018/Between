let users = [];

function newUser(id, username, room){
    const user = {id, username, room};

    users.push(user);
    // console.log(users)
    return user
}

function getActiveUser(id){
    return users.find(user => user.id === id)
}

function switchUser(){
    return users = [];
}

function exitRoom(id){
    const index = users.findIndex(user => user.id === id);

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

module.exports = {
    newUser,
    getActiveUser,
    switchUser,
    exitRoom,
};