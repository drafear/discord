exports.token = "MjU1Njg2NzIzMzQ4OTg3OTA0.CyhOYA.7M_eXtgxiCuxnAAkpoaAl19BaY8",
exports.url = {
    list: "http://us.battle.net/forums/en/overwatch/21446648/",
    mongodb: (() => {
        let res = "localhost:27017/db";
        if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
            res = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
            process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
            process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
            process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
            process.env.OPENSHIFT_APP_NAME;
        }
        return `mongodb://${res}`;
    })(),
};
