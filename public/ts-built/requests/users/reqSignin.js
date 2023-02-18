"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = exports.signin = void 0;
var signin = function () { return __awaiter(void 0, void 0, void 0, function () {
    var email, password;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, document.getElementById('email')];
            case 1:
                email = _a.sent();
                return [4 /*yield*/, document.getElementById('psw')];
            case 2:
                password = _a.sent();
                return [4 /*yield*/, fetch('http://localhost:3000/signin', {
                        method: 'POST',
                        headers: {
                            "Content-type": "application/json",
                        },
                        body: JSON.stringify({
                            "email": email.value,
                            "password": password.value
                        })
                    })
                        .then(function (response) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); })
                        .then(function (data) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!data.token) return [3 /*break*/, 3];
                                    return [4 /*yield*/, localStorage.setItem('token', data.token)];
                                case 1:
                                    _a.sent();
                                    // window.location.href = "views/accountpage.html";
                                    // window.location.replace('views/accountpage.html');
                                    return [4 /*yield*/, location.assign("views/accountpage.html")];
                                case 2:
                                    // window.location.href = "views/accountpage.html";
                                    // window.location.replace('views/accountpage.html');
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    document.getElementById('id_alert_signin').style.display = 'block';
                                    _a.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })
                        .catch(function (error) {
                        document.getElementById('id_alert_signin').style.display = 'block';
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.signin = signin;
var addUser = function () {
    var token = localStorage.getItem('token');
    console.log(token);
    fetch('http://localhost:3000/users/adduser', {
        method: 'POST',
        headers: {
            "Content-type": "application/json",
            "authorization": "Bearer ".concat(token)
        },
        body: JSON.stringify({
            "email": "azizkale@hotmail.com",
            "password": "123456"
        })
    })
        .then(function (response) {
        console.log(response);
    })
        .catch(function (error) {
        console.log('Request failed', error);
    });
};
exports.addUser = addUser;
