
var React = require('react/addons');
window.React = React;


var App = require('./components/app.jsx');
var AmpersandCollection = require('ampersand-collection');
var AmpersandState = require('ampersand-state');
var deval = require('deval');

var CallStack = require('./models/callstack');

var Code = require('./models/code');
var Apis = require('./models/apis');
var CallbackQueue = require('./models/callback-queue');
var RenderQueue = require('./models/render-queue');


var Router = require('./router');
//var Modal = require('react-modal');


app = {};
app.router = new Router();
app.store = {
    //StackFrame
    callstack: new CallStack(),
    //Code Editor
    code: new Code(),
    // Timeout || Query
    apis: new Apis(),
    //Callback
    queue: new CallbackQueue(),
    //Render
    renderQueue: new RenderQueue()
};

app.store
    .code
    .on('change:codeLines', function () {
        console.log('change:codeLines!!');
    });

app.store
    .code
    .on('change:encodedSource', function () {
        app.router
            .navigate('?code=' + app.store.code.encodedSource);
    });

//app.store.code.on('all', function () {
//    console.log('Code event', arguments);
//});

app.store
    .code
    .on('node:will-run', function (id, source, invocation) {
        app.store
            .callstack
            .add({
                _id: id,
                code: source
            });
    });

app.store
    .code
    .on('node:did-run', function (id, invocation) {
        app.store
            .callstack
            .pop();

            //app.store.callstack.remove(app.store.callstack.at(app.store.call
            //app.store.callstack.remove(id + ':' + invocation);
    });

app.store
    .code
    .on('webapi:started', function (data) {
        app.store
            .apis
            .add(data, { merge: true });
    });

app.store
    .code
    .on('callback:shifted', function (id) {
        var appStore = app.store;
        var callback = appStore.queue.get(id);

        if (!callback) {
            callback = appStore.apis.get(id);
        }

        appStore
            .callstack
            .add({
                id: callback.id.toString(),
                code: callback.code,
                isCallback: true
            });

        appStore
            .queue
            .remove(callback);
    });

app.store
    .code
    .on('callback:completed', function (id) {
        //app.store.callstack.remove(id.toString());
        app.store
            .callstack
            .pop();
    });

app.store
    .code
    .on('callback:spawn', function (data) {
        var webapi = app.store.apis.get(data.apiId);
        if (webapi) {
                webapi.trigger('callback:spawned', webapi);
            }

            app.store
                .queue
                .add(data);
    });

app.store
    .apis
    .on('callback:spawn', function (data) {
        app.store
            .queue
            .add(data);
    });

app.store
    .code
    .on('reset-everything', function () {
        var appStore = app.store;

        appStore
            .renderQueue
            .reset();

        appStore
            .queue
            .reset();

        appStore
            .callstack
            .reset();

        appStore
            .apis
            .reset();
});

app.store
    .code
    .on('paused', function () {
        app.store
            .apis
            .pause();
    });

app.store
    .code
    .on('resumed', function () {
        app.store
            .apis
            .resume();
    });

app.store
    .callstack
    .on('all', function () {
        var appStore = app.store;

        if (appStore.callstack.length === 0) {
            appStore.renderQueue.shift();
        }
    });

app.store
    .renderQueue
    .on('add', function () {
        var appStore = app.store;

        if (appStore.callstack.length === 0) {
            appStore.renderQueue.shift();
        }
    });


app.router
    .history
    .start({ pushState: true });

/**
*   TODO:
*   -----
*   deactive modal for now.
*   place modal content in a new area where
*   instructions can be accessed.
*/
//Modal.setAppElement(document.body);
//Modal.injectCSS();



React.renderComponent(
    App(),
    document.body
);
