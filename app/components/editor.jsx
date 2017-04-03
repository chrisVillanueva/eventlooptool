/* JSX: React.DOM */

var React = require('react');
var EventMixin = require('react-backbone-events-mixin');
var AceEditor = require('./ace-editor.jsx');

module.exports = React.createClass({
    mixins: [
        EventMixin
    ],

    registerListeners: function (props, state) {
        var self = this;

        this.listenTo(state.code, 'change', function () {
            this.forceUpdate();
        }.bind(this));

        this.listenTo(state.code, 'node:will-run', function (id) {
            var node = self.refs.code.getDOMNode().querySelector('#node-' + id);
            node.classList.add('running');
        });

        this.listenTo(state.code, 'node:did-run', function (id) {
            var node = self.refs.code.getDOMNode().querySelector('#node-' + id);
            node.classList.remove('running');
        });
    },

    getInitialState: function () {
        return {
            code: app.store.code,
            editing: true
        };
    },

    onCodeChange: function (newCode) {
        this.state.code.codeLines = newCode;
    },

    onEditBlur: function () {
        this.setState({ editing: false });
        //var newCode = this.refs.code.getDOMNode().innerText;
        //this.state.code.html = newCode;
        //this.setState({ editing: false });
    },

    saveAndRunCode: function () {
        this.setState({ editing: false });
        this.runCode();
    },

    runCode: function () {
        this.state.code.run();
    },

    pauseCode: function () {
        this.state.code.pause();
    },

    resumeCode: function () {
        this.state.code.resume();
    },

    onEditFocus: function () {
        this.state.code.resetEverything();
        this.setState({ editing: true });
    },

    render: function () {
        if (this.state.editing) {
            return (
                <div className="flexChild columnParent">
                    <div className='editor-switch panel-controls'>
                        <span className="panel-label">
                            <span>
                                <i className="fa fa-code" />
                            </span>
                            JS Editor
                        </span>
                        <button  type="button"
                                 className="btn btn-sm btn-primary"
                                 onClick={this.saveAndRunCode}>
                            Save + Run
                        </button>
                    </div>
                    <AceEditor
                        mode="javascript"
                        //onBlur={this.onEditBlur}
                        onCodeChange={this.onCodeChange}
                        initialValue={this.state.code.rawCode}
                    />
                </div>
            );
        } else {
            var i = 0;
            var lines = this.state.code.codeLines.map(function () { i++; return i; }).join(String.fromCharCode(10));

            return (
                <div className="flexChild columnParent">
                    <div className='editor-switch panel-controls'>
                        <span className="panel-label">
                            <span>
                                <i className="fa fa-code" />
                            </span>
                            JS Editor
                        </span>
                        <div className="btn-group" role="group">
                            <button  type="button"
                                     className="btn btn-sm btn-primary"
                                     onClick={this.onEditFocus}>
                                Edit
                            </button>
                            <button  type="button"
                                     className="btn btn-sm btn-primary"
                                     onClick={this.runCode}>
                                Rerun
                            </button>
                            <button  type="button"
                                     className="btn btn-sm btn-danger"
                                     onClick={this.pauseCode}>
                                Pause
                            </button>
                            <button  type="button"
                                     className="btn btn-sm btn-success"
                                     onClick={this.resumeCode}>
                                Resume
                            </button>
                        </div>
                    </div>
                    <div
                      className="editor flexChild processing"
                      dangerouslySetInnerHTML={ {__html: this.state.code.wrappedHtml} }
                      onClick={this.onEditFocus}
                      ref="code"
                      data-lines={lines}
                    ></div>
                </div>
            );

        }
    }
});
