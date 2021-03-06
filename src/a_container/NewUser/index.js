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

import UserInfo from "./container/UserInfo";
import DealerInfo from "./container/DealerInfo";
import DealerInfoDetail from "./container/DealerInfoDetail";
import CouponCard from "./container/CouponCard";
import UserInfoRecord from "./container/UserInfoRecord";
import UserInfoCount from "./container/UserInfoCount";
import ProvincialManager from "./container/ProvincialManager"
import Messageboard from "./container/Messageboard"

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
            to={`${this.props.match.path}/userinfo`}
          />
          <Route
            exact
            path={`${this.props.match.path}/userinfo`}
            component={UserInfo}
          />
          <Route
            exact
            path={`${this.props.match.path}/dealerinfo`}
            component={DealerInfo}
          />
          <Route
            exact
            path={`${this.props.match.path}/dealerinfoDetail`}
            component={DealerInfoDetail}
          />
          <Route
            exact
            path={`${this.props.match.path}/couponCard`}
            component={CouponCard}
          />
          <Route
            exact
            path={`${this.props.match.path}/userinfoRecord`}
            component={UserInfoRecord}
          />
          <Route
            exact
            path={`${this.props.match.path}/userinfocount`}
            component={UserInfoCount}
          />
          <Route
            exact
            path={`${this.props.match.path}/provincialManager`}
            component={ProvincialManager}
          />
          <Route
            exact
            path={`${this.props.match.path}/Messageboard`}
            component={Messageboard}
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
