exports.token = "MjU0OTczNDkwNjg2NDU5OTA0.CyYCmQ.1iDutCmxi5gwSey542N37-mxkDs",
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
