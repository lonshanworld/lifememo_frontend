class messageModel{
    constructor(userName, userId,profileimgurl, text, imgurl, datetime){
        this.userName = userName;
        this.userId = userId;
        this.text = text;
        this.datetime = datetime;
        this.imgurl = imgurl;
        this.profileimgurl = profileimgurl;
    }
}

export default messageModel;