"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getTimeStamp() {
    var today = new Date();
    var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    var seconds = today.getSeconds().toString().padStart(2, '0');
    var time = date + " " + today.getHours() + ":" + today.getMinutes() + ":" + seconds;
    return time;
}
exports.default = { getTimeStamp: getTimeStamp };
