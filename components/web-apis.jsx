var React = require('react');
var WebApiTimer = require('./web-api-timer.jsx');
var EventMixin = require('react-backbone-events-mixin');

module.exports = React.createClass({
    mixins: [
        EventMixin
    ],

    registerListeners: function (props, state) {
        this.listenTo(state.apis, 'all', function () {
            this.forceUpdate();
        }.bind(this));
    },

    getInitialState: function () {
        return {
            apis: app.store.apis
        };
    },

    render: function () {
        var apis = this.state.apis.map(function (api) {
            if (api.type === 'timeout') {
                return <WebApiTimer timeout={api.timeoutString} key={api.id}>{api.code}</WebApiTimer>;
            }
        });

        return (
          <div>
            {apis}
          </div>
        )
    }
});