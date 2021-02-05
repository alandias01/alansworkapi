"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __importDefault(require("./utils"));
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var word_1 = __importDefault(require("./routes/word"));
var cors_1 = __importDefault(require("cors"));
var port = process.env.EXPRESS_PORT;
var user = process.env.MONGOATLAS_USER;
var pw = process.env.MONGOATLAS_PASSWORD;
var db = process.env.MONGOATLAS_DB;
var mongoAtlasConnectionString = "mongodb+srv://" + user + ":" + pw + "@cluster0-yznr0.mongodb.net/" + db + "?retryWrites=true&w=majority";
var connOptions = { useNewUrlParser: true, useUnifiedTopology: true };
var isProduction = process.env.NODE_ENV === 'production';
var app = express_1.default();
app.use(function (req, res, next) {
    var time = utils_1.default.getTimeStamp();
    var msg = "METHOD: [" + req.method + "] - URL: [" + req.url + "] - STATUS: [" + res.statusCode + "] - IP: [" + req.socket.remoteAddress + "] - TimeStamp:[" + time + "]";
    console.log(msg);
    next();
});
!isProduction && app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', word_1.default);
var errHandler = function (err, req, res, next) {
    res.status(500).json({ NonDefaultErrorHandler: err.stack });
};
app.use(errHandler);
if (isProduction) {
    app.listen(function () {
        console.log('Express Listening');
    });
}
else {
    app.listen(port, function () {
        console.log('Express Listening');
    });
}
mongoose_1.default
    .connect(mongoAtlasConnectionString, connOptions)
    .then(function () {
    console.log('Mongoose connected');
})
    .catch(function (err) {
    console.log('Mongoose connection error');
    console.log(err);
});
