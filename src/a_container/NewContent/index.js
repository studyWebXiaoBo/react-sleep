/* 体检管理模块下面的 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link, BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./index.scss";

// ==================
// 所需的所有组件
// ==================

import Banner from "./container/Banner";
import Cardlist from "./container/Cardlist";
import Release from "./container/Release";
import Activity from "./container/Activity";
import H5Card from "./container/H5Card";
import assistantType from "./container/assistantType";
import assistant from "./container/assistant";
import ColumnZB from "./container/ColumnZB";  //直播栏目


// ==================
// 本页面所需action
// ==================

import {} from "../../a_action/app-action";

// ==================
// Definition
// ==================

class TheContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log("这是什么：", this.props.match);
  }

  componentWillReceiveProps(nextP) {}

  render() {
    return (
      <div key="page" className="allpage page-shop">
        <Switch>
          <Redirect
            exact
            from={`${this.props.match.path}`}
            to={`${this.props.match.path}/banner`}
          />
          <Route
            exact
            path={`${this.props.match.path}/banner`}
            component={Banner}
          />
          <Route
            exact
            path={`${this.props.match.path}/cardlist`}
            component={Cardlist}
          />
          <Route
            exact
            path={`${this.props.match.path}/consulting/ColumnZB`}   //直播栏目
            component={ColumnZB}
          />
          <Route
            exact
            path={`${this.props.match.path}/consulting/Release`}  //直播列表
            component={Release}
          />
          <Route
            exact
            path={`${this.props.match.path}/question/assistantType`}  //智能客服-问答分类
            component={assistantType}
          />
          <Route
            exact
            path={`${this.props.match.path}/question/assistant`}   //智能客服-问答列表
            component={assistant}
          />
          <Route
            exact
            path={`${this.props.match.path}/activity`}
            component={Activity}
          />
          <Route
            exact
            path={`${this.props.match.path}/H5Card`}
            component={H5Card}
          />
        </Switch>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

TheContainer.propTypes = {
  location: P.any,
  history: P.any,
  match: P.any,
  actions: P.any
};

// ==================
// Export
// ==================

export default connect(
  state => ({}),
  dispatch => ({
    actions: bindActionCreators({}, dispatch)
  })
)(TheContainer);
