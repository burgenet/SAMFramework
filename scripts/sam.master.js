var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var App;
(function (App) {
    var StateActionModel = (function () {
        function StateActionModel() {
            var _this = this;
            this.Redraw = function (representation) { };
            this.Representation = function (model) { return ''; };
            this.view = {
                display: function (html, element) {
                    element.innerHTML = html;
                },
                init: function (model) { return null; },
                views: {}
            };
            this.state = {
                view: this.view,
                representation: function (model) {
                    var representation = 'oops... something went wrong, the system is in an invalid state';
                    representation = _this.Representation(model) || representation;
                    _this.Redraw(representation);
                },
                render: function (model) {
                    _this.state.representation(model);
                    if (_this.state.nextAction) {
                        _this.state.nextAction(model);
                    }
                },
                states: {}
            };
            this.model = {
                present: function (data) { },
                state: this.state,
                raw: null,
                widgets: []
            };
            this.action = {};
        }
        return StateActionModel;
    }());
    App.StateActionModel = StateActionModel;
    var Screen = (function () {
        function Screen(container) {
            var _this = this;
            this.SAM = new StateActionModel();
            this.Container = container;
            this.Element = document.createElement('div');
            container.appendChild(this.Element);
            this.SAM.view.init = function (model) {
                //setTimeout(()=>{
                _this.Load();
                //})
                return _this.SAM.view.views.loading(model);
            };
            this.SAM.view.views.loading = function (model) {
                return "<h3>Loading...</h3>";
            };
            this.SAM.view.views.ready = function (model) {
                return _this.Template;
                ;
            };
            this.SAM.state.states.ready = function (model) {
                return model.raw != null;
            };
            this.SAM.state.states.loading = function (model) {
                return model.raw == null;
            };
            this.SAM.model.present = function (data) {
                if (data.raw) {
                    _this.SAM.model.raw = data.raw;
                }
                _this.SAM.state.render(_this.SAM.model);
            };
            this.SAM.Redraw = function (representation) { _this.Redraw(_this.Container, representation); };
            this.SAM.Representation = function (model) { return _this.Representation(model); };
            this.SAM.view.display(this.SAM.view.init(this.SAM.model), this.Element);
        }
        Screen.prototype.Load = function () {
        };
        Screen.prototype.Representation = function (model) {
            var representation = null;
            if (this.SAM.state.states.ready(model)) {
                representation = this.SAM.state.view.views.ready(model);
            }
            else if (this.SAM.state.states.loading(model)) {
                this.Load();
                representation = this.SAM.state.view.views.loading(model);
            }
            return representation;
        };
        Screen.prototype.Redraw = function (container, representation) {
            this.SAM.state.view.display(representation, container);
        };
        return Screen;
    }());
    App.Screen = Screen;
})(App || (App = {}));
var App;
(function (App) {
    var Test;
    (function (Test) {
        var LoginScreen = (function (_super) {
            __extends(LoginScreen, _super);
            function LoginScreen(container) {
                var _this = _super.call(this, container) || this;
                _this.Template = "\n            <h3>Login In Here</h3>\n        ";
                return _this;
            }
            LoginScreen.prototype.Load = function () {
                var _this = this;
                setTimeout(function () {
                    _this.SAM.model.present({ raw: {} });
                }, 2000);
            };
            return LoginScreen;
        }(App.Screen));
        Test.LoginScreen = LoginScreen;
    })(Test = App.Test || (App.Test = {}));
})(App || (App = {}));
setTimeout(function () {
    var ls = new App.Test.LoginScreen(document.getElementById("screencontainer"));
}, 250);
//# sourceMappingURL=sam.master.js.map