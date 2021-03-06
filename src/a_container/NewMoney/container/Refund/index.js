/* List 商城管理/订单管理/订单列表 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import P from "prop-types";
import {
  Form,
  Button,
  Icon,
  Input,
  Table,
  message,
  Modal,
  Tooltip,
  Tabs,
  Select,
  Divider,
  Cascader,
  DatePicker
} from "antd";
import "./index.scss";
import moment from "moment";
import _ from "lodash";
import Config from "../../../../config/config";
import tools from "../../../../util/tools"; // 工具
import Power from "../../../../util/power"; // 权限
import { power } from "../../../../util/data";
// ==================
// 所需的所有组件
// ==================

// ==================
// 本页面所需action
// ==================

import {
  findProductTypeByWhere,
  onChange,
  onOk,
  refundList,
  refundAuditEgis,
  AuditLog,
  RefundExportList
} from "../../../../a_action/shop-action";

// ==================
// Definition
// ==================
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // 当前页面全部数据
      data2: [], // 操作日志全部数据
      productTypes: [], //所有的产品类型
      productModels: [], // 所有的产品型号
      searchProductName: "", // 搜索 - 产品名称
      searchProductType: "", // 搜索 - 产品类型
      searchMinPrice: undefined, // 搜索 - 最小价格
      searchMaxPrice: undefined, // 搜索- 最大价格
      searchrefundBeginTime: "", // 搜索 - 申请退款开始时间
      searchrefundEndTime: "", // 搜索- 申请退款结束时间
      searchTime: "", // 搜索 - 退款到账开始时间
      searchTime2: "", //搜索 - 退款到账结束时间
      searchorderFrom: "", //搜索 - 订单来源
      searchName: "", // 搜索 - 状态
      searchPayType: "", //搜索 - 支付类型
      searchmchOrderIdChange: "", // 流水号查询
      searchConditions: "", //搜索 - 退款状态
      searchConditionsType: "", //搜索 - 订单状态
      searchorderNo: "", //搜索 - 子订单号
      searchMainOrderId:'',//搜索 - 主订单号
      searchUserName: "", //搜索 - 用户id
      searchActivity: "", //搜索 - 活动方式
      searchFlagChange:"",   //搜索 - 操作方式
      searchOperationBegin:"", //搜索 - 操作开始时间
      searchOperationEnd:"", //搜索 - 操作结束时间
      nowData: null, // 当前选中的信息，用于查看详情、修改、分配菜单
      addnewModalShow: false, // 查看地区模态框是否显示
      upModalShow: false, // 修改模态框是否显示
      upLoading: false, // 是否正在修改用户中
      pageNum: 1, // 当前第几页
      pageSize: 10, // 每页多少条
      total: 0, // 数据库总共多少条数据
      total2: 0, // 操作日志总共多少条数据
      citys: [] // 符合Cascader组件的城市数据
    };
  }

  componentDidMount() {
    this.getAllProductType(); // 获取所有的产品类型
    // this.onGetDataJournal(this.state.pageNum, this.state.pageSize); //操作日志
    this.onGetData(this.state.pageNum, this.state.pageSize);
  }

  componentWillReceiveProps(nextP) {
    if (nextP.citys !== this.props.citys) {
      this.setState({
        citys: nextP.citys.map((item, index) => ({
          id: item.id,
          value: item.areaName,
          label: item.areaName,
          isLeaf: false
        }))
      });
    }
  }

  // 查询当前页面所需列表数据
  onGetData(pageNum, pageSize) {
    const params = {
      pageNum,
      pageSize,
      id: this.state.searchId,
      conditions: this.state.searchConditions, //退款状态
      userId: this.state.searchUserName.trim(),
      productType: this.state.searchProductType,
      orderNo: this.state.searchorderNo.trim(),
      mainOrderId:this.state.searchMainOrderId.trim(),
      minPrice: this.state.searchMinPrice,
      maxPrice: this.state.searchMaxPrice,
      mchOrderId: this.state.searchmchOrderIdChange.trim(),
      userType: this.state.searchType,
      activityType: this.state.searchActivity,
      refundBeginTime: this.state.searchrefundBeginTime
        ? `${tools.dateToStr(this.state.searchrefundBeginTime.utc()._d)} `
        : "",
      refundEndTime: this.state.searchrefundEndTime
        ? `${tools.dateToStr(this.state.searchrefundEndTime.utc()._d)} `
        : "",
      beginTime: this.state.searchTime
        ? `${tools.dateToStr(this.state.searchTime.utc()._d)}`
        : "",
      endTime: this.state.searchTime2
        ? `${tools.dateToStr(this.state.searchTime2.utc()._d)} `
        : ""
    };
    this.props.actions.refundList(tools.clearNull(params)).then(res => {
      console.log("返回的什么：", res.data);
      if (res.status === "0") {
        this.setState({
          data: res.data.result || [],
          pageNum,
          pageSize,
          total: res.data.total
        });
      }
    });
  }

  // 查询当前页面 - 操作日志 - 所需列表数据
  onGetDataJournal(pageNum, pageSize) {
    const params = {
      pageNum,
      pageSize,
      type:1,
      userType: this.state.searchUserType,
      withdrawType: this.state.searchWithdrawType,
      id: this.state.searchId,
      orderNo: this.state.searchorderNo.trim(),
      operation:this.state.searchFlagChange,
      partnerTradeNo: this.state.searchPartnerTradeNo,
      beginTime: this.state.searchOperationBegin
        ? `${tools.dateToStr(this.state.searchOperationBegin.utc()._d)}`
        : "",
      endTime: this.state.searchOperationEnd
        ? `${tools.dateToStr(this.state.searchOperationEnd.utc()._d)} `
        : ""
    };
    this.props.actions.AuditLog(tools.clearNull(params)).then(res => {
      if (res.status === '0') {
        this.setState({
          data2: res.data.result || [],
          pageNum,
          pageSize,
          total2: res.data.total
        });
      }
    });
  }

  // 工具 - 根据受理状态码查询对应的名字
  getConditionNameById(id) {
    switch (id) {
      case 0:
        return "已关闭";
      case 1:
        return "未完成";
      case 4:
        return "已完成";
      default:
        return "";
    }
  }

  // 获取所有的产品类型，当前页要用
  getAllProductType() {
    this.props.actions
      .findProductTypeByWhere({ pageNum: 0, pageSize: 9999 })
      .then(res => {
        if (res.status === "0") {
          this.setState({
            productTypes: res.data.result || []
          });
        }
      });
  }

  // 工具 - 根据产品类型ID查产品类型名称
  findProductNameById(id) {
    const t = this.state.productTypes.find(
      item => String(item.id) === String(id)
    );
    return t ? t.name : "";
  }

  // 工具 - 根据ID获取用户类型
  getUserType(id) {
    switch (String(id)) {
      case "0":
        return "经销商（体验版）";
      case "1":
        return "经销商（微创版）";
      case "2":
        return "经销商（个人版）";
      case "3":
        return "分享用户";
      case "4":
        return "普通用户";
      case "5":
        return "企业版经销商";
      case "6":
        return "企业版子账号";
      case "7":
        return "分销商";
      default:
        return "";
    }
  }

  // 工具 - 根据ID获取用户来源名字
  getListByModelId(id) {
    switch (String(id)) {
      case "3":
        return "退款中";
      case "4":
        return "退款完成";
      case "5":
        return "退款失败";
      default:
        return "";
    }
  }

  //工具 - 根据活动类型id获取活动名称
  getActivity(id) {
    switch (String(id)) {
      case "1":
        return "普通产品";
      case "2":
        return "活动产品";
      default:
        return "";
    }
  }

  //工具 - 用户具体收货地体
  getAddress(s, c, q, x) {
    if (!s) {
      return "";
    }
    return `${s}${c}${q}${x}`;
  }

  //搜索 - 退款到账开始时间
  searchTime(v) {
    this.setState({
      searchTime: _.cloneDeep(v)
    });
  }

  //搜索 - 退款到账结束时间
  searchTime2(v) {
    this.setState({
      searchTime2: _.cloneDeep(v)
    });
  }

  //搜索 - 操作开始时间
  searchOperationBegin(v) {
    this.setState({
      searchOperationBegin: _.cloneDeep(v)
    });
  }

  //搜索 - 操作结束时间
  searchOperationEnd(v) {
    this.setState({
      searchOperationEnd: _.cloneDeep(v)
    });
  }

  //搜索 - 退款状态改变时触发
  searchConditionsChange(e) {
    this.setState({
      searchConditions: e
    });
  }

  //搜索 - 子订单号
  searchOrderNoChange(e) {
    this.setState({
      searchorderNo: e.target.value
    });
    console.log("e是什么；", e.target.value);
  }
  
  //搜索 - 主订单号
  searchMainOrderIdChange(e) {
    this.setState({
      searchMainOrderId: e.target.value
    });
  }

  //搜索 - 用户账号
  searchUserNameChange(e) {
    this.setState({
      searchUserName: e.target.value
    });
  }

  // 点击查看地区模态框出现
  onAddNewShow() {
    const me = this;
    const { form } = me.props;
    form.resetFields(["addnewCitys"]);
    this.setState({
      addOrUp: "add",
      fileList: [],
      fileListDetail: [],
      addnewModalShow: true
    });
  }

  // 关闭模态框
  onAddNewClose() {
    this.setState({
      addnewModalShow: false
    });
  }

  //产品类型所对应的公司
  Productcompany(id) {
    switch (String(id)) {
      case "1":
        return "翼猫科技发展（上海）有限公司";
      case "2":
        return "上海养未来健康食品有限公司";
      case "3":
        return "上海翼猫生物科技有限公司";
      case "5":
        return "上海翼猫智能科技有限公司";
    }
  }

  // 工具 - 订单状态
  getConditionNameById(id) {
    switch (id) {
      case 0:
        return "待付款";
      case 1:
        return "待审核";
      case 2:
        return "待发货";
      case 3:
        return "待收货";
      case 4:
        return "已完成";
      default:
        return "";
    }
  }

  // 搜索 - 流水号输入框值改变时触发
  mchOrderIdChange(e) {
    this.setState({
      searchmchOrderIdChange: e.target.value
    });
  }

  // 搜索 - 订单来源输入框值改变时触发
  searchProductType(v) {
    this.setState({
      searchProductType: v
    });
  }

  //搜索 - 操作方式
  searchFlagChange(e){
    this.setState({
      searchFlagChange:e
   })
  }

  //搜索 - 用户类型
  onSearchType(v) {
    this.setState({
      searchType: v
    });
  }

  //搜索 - 活动类型
  searchActivityType(v) {
    this.setState({
      searchActivity: v
    });
  }

  // 搜索 - 最小价格变化
  searchMinPriceChange(v) {
    this.setState({
      searchMinPrice: v.target.value
    });
  }

  // 搜索 - 最大价格变化
  searchMaxPriceChange(v) {
    this.setState({
      searchMaxPrice: v.target.value
    });
  }

  // 搜索 - 申请退款开始时间
  searchApplyBeginTime(v) {
    console.log("是什么：", v);
    this.setState({
      searchrefundBeginTime: _.cloneDeep(v)
    });
  }

  // 搜索 - 申请退款结束时间
  searchApplyEndTime(v) {
    console.log("触发：", v);
    // let date = v;
    // const now = new Date();
    // if (v._d.getFullYear() === now.getFullYear() && v._d.getMonth() === now.getMonth() && v._d.getDate() === now.getDate()) {
    //     date = moment();
    // }
    this.setState({
      searchrefundEndTime: _.cloneDeep(v)
    });
  }

  //Input中的删除按钮所删除的条件
  emitEmpty() {
    this.setState({
      searchorderNo: ""
    });
  }

  emitEmpty1() {
    this.setState({
      searchUserName: ""
    });
  }

  emitEmpty2() {
    this.setState({
      searchmchOrderIdChange: ""
    });
  }
  
  emitEmpty3() {
    this.setState({
      searchMainOrderId: ""
    });
  }

  emitEmpty5() {
    this.setState({
      searchMinPrice: ""
    });
  }

  emitEmpty6() {
    this.setState({
      searchMaxPrice: ""
    });
  }

  // 搜索
  onSearch() {
    this.onGetData(1, this.state.pageSize);
  }

    //搜索 - 操作日志
    onSearchJournal(){
        this.onGetDataJournal(1, this.state.pageSize);
    }

  //点击操作日志时发起请求
  auditList(){
      this.onGetDataJournal(this.state.pageNum, this.state.pageSize)
  }

  //导出
  onExport() {
    this.onExportData(this.state.pageNum, this.state.pageSize);
  }

  // 导出退款记录列表数据
  onExportData(pageNum, pageSize) {
    const params = {
      pageNum,
      pageSize,
      id: this.state.searchId,
      flag: this.state.searchConditions, //退款状态
      userId: this.state.searchUserName,
      productType: this.state.searchProductType,
      orderNo: this.state.searchorderNo.trim(),
      minPrice: this.state.searchMinPrice,
      maxPrice: this.state.searchMaxPrice,
      mchOrderId: this.state.searchmchOrderIdChange,
      userType: this.state.searchType,
      activityType: this.state.searchActivity,
      refundBeginTime: this.state.searchrefundBeginTime
        ? `${tools.dateToStr(this.state.searchrefundBeginTime.utc()._d)} `
        : "",  //退款申请时间-开始
      refundEndTime: this.state.searchrefundEndTime
        ? `${tools.dateToStr(this.state.searchrefundEndTime.utc()._d)} `
        : "",  //退款申请时间-结束
      beginTime: this.state.searchTime
        ? `${tools.dateToStr(this.state.searchTime.utc()._d)}`
        : "", //退款到账时间 - 开始
      endTime: this.state.searchTime2
        ? `${tools.dateToStr(this.state.searchTime2.utc()._d)} `
        : "", // 退款到账时间 - 结束
    };
    tools.download(tools.clearNull(params),`${Config.baseURL}/manager/export/refund/record`,'post','退款记录.xls')
  }

  // 查询某一条数据的详情
  onQueryClick(record) {
    console.log("是什么：", record);
    this.setState({
      nowData: record,
      queryModalShow: true,
      activityStatus: record.activityStatus,
      refundStatus: record.refundStatus
    });
    console.log("activityStatus的数值是：", record.activityStatus);
  }

  // 查看详情模态框关闭
  onQueryModalClose() {
    this.setState({
      queryModalShow: false
    });
  }

  //单独某条撤回审核通过
  onAdoptAloneRefuse(record) {
    const params = {
      refundId: record.refundId,
      refundStatus: "3"
    };
    this.props.actions
      .refundAuditEgis(params)
      .then(res => {
        if (res.status === "0") {
          message.success("修改成功", 1);
          this.onGetData(this.state.pageNum, this.state.pageSize);
        } else {
          message.error(res.message || "修改失败，请重试");
        }
      })
      .catch(() => {
        message.error("修改失败");
      });
  }

  // 表单页码改变
  onTablePageChange(page, pageSize) {
    console.log("页码改变：", page, pageSize);
    this.onGetData(page, pageSize);
  }

  // 操作日志--表单页码改变
  onTablePageChangeJournal(page, pageSize) {
    console.log("页码改变：", page, pageSize);
    this.onGetDataJournal(page, pageSize);
  }

  // 构建字段
  makeColumns() {
    const columns = [
      {
        title: "序号",
        fixed: "left",
        dataIndex: "serial",
        key: "serial",
        width: 50
      },
      {
        title:'主订单号',
        dataIndex:'mainOrderId',
        key:'mainOrderId'
      },
      {
        title: "子订单号",
        dataIndex: "orderNo",
        key: "orderNo"
      },
      {
        title: "用户身份",
        dataIndex: "userType",
        key: "userType",
        render: text => this.getUserType(text)
      },
      {
        title: "用户id",
        dataIndex: "userId",
        key: "userId"
      },
      {
        title: "活动方式",
        dataIndex: "activityType",
        key: "activityType",
        render: text => this.getActivity(text)
      },
      {
        title: "产品类型",
        dataIndex: "typeId",
        key: "typeId",
        render: text => this.findProductNameById(text)
      },
      {
        title: "产品公司",
        dataIndex: "company",
        key: "company",
        render: text => this.Productcompany(text)
      },
      {
        title: "产品名称",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "产品型号",
        dataIndex: "modelType",
        key: "modelType"
      },
      {
        title: "数量",
        dataIndex: "count",
        key: "count"
      },
      {
        title: "订单总金额",
        dataIndex: "fee",
        key: "fee"
      },
      {
        title: "退款状态",
        dataIndex: "activityStatus",
        key: "activityStatus",
        render: text => this.getListByModelId(text)
      },
      {
        title: "申请退款时间",
        dataIndex: "auditTime",
        key: "auditTime"
      },
      // {
      //   title:'退款审核时间',
      //   dataIndex:'',
      //   key:'',
      // },
      {
        title: "流水号",
        dataIndex: "mchOrderId",
        key: "mchOrderId"
      },
      {
        title: "退款到账时间",
        dataIndex: "theAccountTime",
        key: "theAccountTime"
      },
      {
        title: "操作",
        key: "control",
        fixed: "right",
        width: 100 ,
        render: (text, record) => {
          const controls = [];
          record.activityStatus === 5 &&
            controls.push(
              <span
                key="1"
                className="control-btn red"
                onClick={() => this.onAdoptAloneRefuse(record)}
              >
                <Tooltip placement="top" title="撤销审核">
                  <Icon type="logout" style={{ color: "red" }} />
                </Tooltip>
              </span>
            );
          controls.push(
            <span
              key="0"
              className="control-btn green"
              onClick={() => this.onQueryClick(record)}
            >
              <Tooltip placement="top" title="详情">
                <Icon type="eye" />
              </Tooltip>
            </span>
          );
          const result = [];
          controls.forEach((item, index) => {
            if (index) {
              result.push(<Divider key={`line${index}`} type="vertical" />);
            }
            result.push(item);
          });
          return result;
        }
      }
    ];
    return columns;
  }

  //构建字段 - 操作日志所对应列表
  makeColumnsJournal(){
    const columns = [
      {
        title: "订单号",
        dataIndex:'orderId',
        key:'orderId'
      },
      {
        title:'操作',
        dataIndex:'operation',
        key:'operation'
      },
      {
        title:'操作人',
        dataIndex:'creator',
        key:'creator'
      },
      {
        title:'操作时间',
        dataIndex:'createTime',
        key:'createTime',
      },
      {
        title:'审核理由'
      },
    ]
    return columns;
  }

  // 构建table所需数据
  makeData(data) {
    return data.map((item, index) => {
      return {
        key: index,
        addrId: item.addrId,
        citys:
          item.province && item.city && item.region
            ? `${item.province}/${item.city}/${item.region}`
            : "",
        count: item.count,
        fee: item.fee,
        payType: item.payRecord ? item.payRecord.payType : "",
        orderNo: item.id,
        serial: index + 1 + (this.state.pageNum - 1) * this.state.pageSize,
        modelId: item.product ? item.product.typeCode : "",
        typeId: item.product ? item.product.typeId : "",
        activityStatus: item.activityStatus,
        userName: item.userId,
        userType: item.userInfo ? item.userInfo.userType : "",
        refer: item.refer,
        orderFrom: item.orderFrom,
        activityType: item.activityType,
        realName: item.distributor ? item.distributor.realName : "",
        ambassadorName: item.distributor ? item.distributor.mobile : "",
        userId: item.userInfo.id,
        modelType: item.modelType,
        mainOrderId:item.mainOrderId,//主订单号
        mchOrderId: item.refundRecord ? item.refundRecord.tradeNo : "",
        refundPassTime:item.refundRecord ? item.refundRecord.refundPassTime:'',
        mobile: item.shopAddress ? item.shopAddress.mobile : "",
        province: item.shopAddress ? item.shopAddress.province : "",
        city: item.shopAddress ? item.shopAddress.city : "",
        region: item.shopAddress ? item.shopAddress.region : "",
        street: item.shopAddress ? item.shopAddress.street : "",
        customerName: item.customer ? item.customer.realName : "",
        customerPhone: item.customer ? item.customer.phone : "",
        theAccountTime: item.refundRecord
          ? item.refundRecord.theAccountTime
          : "",
        detail: item.product.typeName ? item.product.typeName.detail : "",
        auditTime: item.auditTime,
        company: item.product ? item.product.typeId : "",
        name: item.product ? item.product.name : "",
        conditions: item.conditions,
        refundId: item.refundRecord ? item.refundRecord.id : "",
        refundDetail: item.refundRecord ? item.refundRecord.refundDetail : ""
      };
    });
  }

  //操作日志 - table所需数据
  makeDataJournal(data2) {
    return data2.map((item, index) => {
      return {
        key: index,
        orderId: item.orderId,
        company: item.productType,
        conditions: item.conditions,
        username: item.username,
        operation: item.operation,
        createTime: item.createTime,
        creator:item.creator,
      };
    });
  }

  render() {
    const me = this;
    const { form } = me.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 9 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      }
    };

    const { searchorderNo } = this.state;
    const { searchUserName } = this.state;
    const { searchmchOrderIdChange } = this.state;
    const { searchMinPrice } = this.state;
    const { searchMaxPrice } = this.state;
    const { searchMainOrderId } = this.state;
    const suffix = searchorderNo ? (
      <Icon type="close-circle" onClick={() => this.emitEmpty()} />
    ) : null;
    const suffix2 = searchUserName ? (
      <Icon type="close-circle" onClick={() => this.emitEmpty1()} />
    ) : null;
    const suffix3 = searchmchOrderIdChange ? (
      <Icon type="close-circle" onClick={() => this.emitEmpty2()} />
    ) : null;
    const suffix4 = searchMainOrderId ? (
      <Icon type="close-circle" onClick={() => this.emitEmpty3()} />
    ) : null;
    const suffix8 = searchMinPrice ? (
      <Icon type="close-circle" onClick={() => this.emitEmpty5()} />
    ) : null;
    const suffix9 = searchMaxPrice ? (
      <Icon type="close-circle" onClick={() => this.emitEmpty6()} />
    ) : null;

    return (
        <div>
          <div className="system-search">
            <Tabs type="card" onTabClick={()=>this.auditList()}>
              <TabPane tab="退款记录" key="1">
                <div className="system-table">
                  <div className="system-table">
                    <ul className="search-ul more-ul">
                      <li>
                        <span>主订单号</span>
                        <Input
                            style={{ width: "172px" }}
                            onChange={e => this.searchMainOrderIdChange(e)}
                            suffix={suffix4}
                            value={searchMainOrderId}
                        />
                      </li>
                      <li>
                        <span>子订单号</span>
                        <Input
                          style={{ width: "172px" }}
                          onChange={e => this.searchOrderNoChange(e)}
                          suffix={suffix}
                          value={searchorderNo}
                        />
                      </li>
                      <li>
                        <span>用户身份</span>
                        <Select
                            allowClear
                            placeholder="全部"
                            style={{ width: "172px" }}
                            onChange={e => this.onSearchType(e)}
                        >
                          <Option value={0}>经销商（体验版）</Option>
                          <Option value={1}>经销商（微创版）</Option>
                          <Option value={2}>经销商（个人版）</Option>
                          <Option value={3}>分享用户</Option>
                          <Option value={4}>普通用户</Option>
                          <Option value={5}>企业版经销商</Option>
                          <Option value={6}>企业版子账号</Option>
                          <Option value={7}>分销商</Option>
                        </Select>
                      </li>
                      <li>
                        <span>用户id</span>
                        <Input
                            style={{ width: "172px" }}
                            suffix={suffix2}
                            value={searchUserName}
                            onChange={e => this.searchUserNameChange(e)}
                        />
                      </li>
                      <li>
                        <span>活动方式</span>
                        <Select
                            placeholder="全部"
                            allowClear
                            style={{ width: "172px" }}
                            onChange={e => this.searchActivityType(e)}
                        >
                          <Option value={1}>普通商品</Option>
                          <Option value={2}>活动商品</Option>
                        </Select>
                      </li>
                      <li>
                        <span>产品类型</span>
                        <Select
                            allowClear
                            placeholder="全部"
                            style={{ width: "172px" }}
                            onChange={e => this.searchProductType(e)}
                        >
                            {this.state.productTypes.map((item, index) => {
                                return (
                                    <Option key={index} value={item.id}>
                                        {item.name}
                                    </Option>
                                );
                            })}
                        </Select>
                      </li>
                      <li>
                        <span>订单总金额</span>
                        <Input
                            style={{ width: "80px" }}
                            min={0}
                            max={999999}
                            placeholder="最小价格"
                            onChange={v => this.searchMinPriceChange(v)}
                            value={searchMinPrice}
                            suffix={suffix8}
                        />
                        --
                        <Input
                            style={{ width: "80px" }}
                            min={0}
                            max={999999}
                            placeholder="最大价格"
                            onChange={e => this.searchMaxPriceChange(e)}
                            value={searchMaxPrice}
                            suffix={suffix9}
                        />
                      </li>
                      <li>
                        <span>退款状态</span>
                        <Select
                            placeholder="全部"
                            allowClear
                            style={{ width: "172px" }}
                            onChange={e => this.searchConditionsChange(e)}
                        >
                          <Option value={3}>退款中</Option>
                          <Option value={4}>退款完成</Option>
                          <Option value={5}>退款失败</Option>
                        </Select>
                      </li>
                      <li>
                        <span style={{ marginRight: "10px" }}>申请退款时间</span>
                        <DatePicker
                            showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="开始时间"
                            onChange={e => this.searchApplyBeginTime(e)}
                            onOk={onOk}
                        />
                        --
                        <DatePicker
                            showTime={{ defaultValue: moment("23:59:59", "HH:mm:ss") }}
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="结束时间"
                            // value={this.state.searchEndTime}
                            onChange={e => this.searchApplyEndTime(e)}
                            onOk={onOk}
                        />
                      </li>
                      {/*<li>*/}
                        {/*<span style={{ marginRight: "10px" }}>退款审核时间</span>*/}
                        {/*<DatePicker*/}
                          {/*showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}*/}
                          {/*format="YYYY-MM-DD HH:mm:ss"*/}
                          {/*placeholder="开始时间"*/}
                          {/*onChange={e => this.searchRefundBeginTime(e)}*/}
                          {/*onOk={onOk}*/}
                        {/*/>*/}
                        {/*--*/}
                        {/*<DatePicker*/}
                          {/*showTime={{ defaultValue: moment("23:59:59", "HH:mm:ss") }}*/}
                          {/*format="YYYY-MM-DD HH:mm:ss"*/}
                          {/*placeholder="结束时间"*/}
                          {/*onChange={e => this.searchRefundEndTime(e)}*/}
                          {/*onOk={onOk}*/}
                        {/*/>*/}
                      {/*</li>*/}
                      <li>
                        <span>流水号查询</span>
                        <Input
                            style={{ width: "172px" }}
                            suffix={suffix3}
                            value={searchmchOrderIdChange}
                            onChange={e => this.mchOrderIdChange(e)}
                        />
                      </li>
                      <li>
                        <span style={{ marginRight: "10px" }}>退款到账时间</span>
                        <DatePicker
                            showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="开始时间"
                            onChange={e => this.searchTime(e)}
                            onOk={onOk}
                        />
                        --
                        <DatePicker
                            showTime={{ defaultValue: moment("23:59:59", "HH:mm:ss") }}
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="结束时间"
                            // value={this.state.searchEndTime}
                            onChange={e => this.searchTime2(e)}
                            onOk={onOk}
                        />
                      </li>
                      <li style={{ marginLeft: "40px" }}>
                        <Button
                            icon="search"
                            type="primary"
                            onClick={() => this.onSearch()}
                        >
                          搜索
                        </Button>
                      </li>
                      <Button icon="download" type="primary" onClick={()=>this.onExport()} style={{marginTop:'2px'}}>
                        导出
                      </Button>
                    </ul>
                  </div>
                  <div className="system-table">
                    <Table
                      columns={this.makeColumns()}
                      dataSource={this.makeData(this.state.data)}
                      scroll={{ x: 2900 }}
                      pagination={{
                        total: this.state.total,
                        current: this.state.pageNum,
                        pageSize: this.state.pageSize,
                        showQuickJumper: true,
                        showTotal: (total, range) => `共 ${total} 条数据`,
                        onChange: (page, pageSize) =>
                          this.onTablePageChange(page, pageSize)
                      }}
                    />
                  </div>
                </div>
                  {/* 查看详情模态框 */}
                <Modal
                    title="查看详情"
                    visible={this.state.queryModalShow}
                    onOk={() => this.onQueryModalClose()}
                    onCancel={() => this.onQueryModalClose()}
                    onChange={() => this.onQueryClick()}
                    wrapClassName={"list"}
                >
                  <Form>
                    <FormItem label="主订单号" {...formItemLayout}>
                      {!!this.state.nowData ? this.state.nowData.mainOrderId : ""}
                    </FormItem>
                    <FormItem label="子订单号" {...formItemLayout}>
                        {!!this.state.nowData ? this.state.nowData.orderNo : ""}
                    </FormItem>
                    <FormItem label="退款状态" {...formItemLayout}>
                        {!!this.state.nowData
                            ? this.getListByModelId(this.state.nowData.activityStatus)
                            : ""}
                    </FormItem>
                    <FormItem label="用户身份" {...formItemLayout}>
                        {!!this.state.nowData
                            ? this.getUserType(this.state.nowData.userType)
                            : ""}
                    </FormItem>
                    <FormItem label="用户id" {...formItemLayout}>
                        {!!this.state.nowData ? this.state.nowData.userId : ""}
                    </FormItem>
                    <FormItem label="活动方式" {...formItemLayout}>
                        {!!this.state.nowData
                            ? this.getActivity(this.state.nowData.activityType)
                            : ""}
                    </FormItem>
                    <FormItem label="产品类型" {...formItemLayout}>
                        {!!this.state.nowData
                            ? this.findProductNameById(this.state.nowData.typeId)
                            : ""}
                    </FormItem>
                    <FormItem label="产品公司" {...formItemLayout}>
                        {!!this.state.nowData
                            ? this.Productcompany(this.state.nowData.company)
                            : ""}
                    </FormItem>
                    <FormItem label="产品型号" {...formItemLayout}>
                        {!!this.state.nowData ? this.state.nowData.modelType : ""}
                    </FormItem>
                    <FormItem label="产品名称" {...formItemLayout}>
                        {!!this.state.nowData ? this.state.nowData.name : ""}
                    </FormItem>
                    <FormItem label="数量" {...formItemLayout}>
                        {!!this.state.nowData ? this.state.nowData.count : ""}
                    </FormItem>
                    <FormItem label="订单总金额" {...formItemLayout}>
                        {!!this.state.nowData ? `￥${this.state.nowData.fee}` : ""}
                    </FormItem>
                    <FormItem label="流水号" {...formItemLayout}>
                        {!!this.state.nowData ? this.state.nowData.mchOrderId : ""}
                    </FormItem>
                    <FormItem label="申请退款时间" {...formItemLayout}>
                      {!!this.state.nowData ? this.state.nowData.auditTime : ""}
                    </FormItem>
                    {/*<FormItem label="退款审核时间" {...formItemLayout}>*/}
                      {/*/!*{!!this.state.nowData ? this.state.nowData.auditTime : ""}*!/*/}
                    {/*</FormItem>*/}
                    <FormItem label="退款到账时间" {...formItemLayout}>
                      {!!this.state.nowData ? this.state.nowData.theAccountTime : ""}
                    </FormItem>
                    <FormItem
                        label="审核时间"
                        {...formItemLayout}
                        className={this.state.activityStatus == 5 ? "hide" : ""}
                    >
                        {!!this.state.nowData ? this.state.nowData.refundPassTime : ""}
                    </FormItem>
                    <FormItem
                        label="审核时间"
                        {...formItemLayout}
                        className={this.state.activityStatus == 4 || this.state.activityStatus == 3 ? "hide" : ""}
                    >
                        {!!this.state.nowData ? this.state.nowData.refundPassTime : ""}
                    </FormItem>
                    <FormItem
                        label="退款失败理由"
                        {...formItemLayout}
                        className={
                            this.state.activityStatus == 4 || this.state.activityStatus == 3
                                ? "hide"
                                : ""
                        }
                    >
                        {!!this.state.nowData ? this.state.nowData.refundDetail : ""}
                    </FormItem>
                  </Form>
                </Modal>
              </TabPane>
              <TabPane tab="操作日志" key="2">
                <div className="system-table">
                  <div className="system-table">
                    <ul className="search-ul more-ul">
                      <li>
                        <span>订单号查询</span>
                        <Input
                            style={{ width: "172px" }}
                            onChange={v => this.searchOrderNoChange(v)}
                            suffix={suffix}
                            value={searchorderNo}
                        />
                      </li>
                      <li>
                        <span>操作</span>
                        <Select
                            placeholder="全部"
                            allowClear
                            style={{ width: "172px" }}
                            onChange={e => this.searchFlagChange(e)}
                        >
                          <Option value={'审核通过'}>审核通过</Option>
                          <Option value={'审核不通过'}>审核不通过</Option>
                          <Option value={'审核撤回'}>审核撤回</Option>
                        </Select>
                      </li>
                      <li>
                        <span style={{ marginRight: "10px" }}>操作时间</span>
                        <DatePicker
                            showTime={{
                                defaultValue: moment("00:00:00", "HH:mm:ss")
                            }}
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="开始时间"
                            onChange={e => this.searchOperationBegin(e)}
                            onOk={onOk}
                        />
                        --
                        <DatePicker
                            showTime={{
                                defaultValue: moment("23:59:59", "HH:mm:ss")
                            }}
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="结束时间"
                            onChange={e => this.searchOperationEnd(e)}
                            onOk={onOk}
                        />
                      </li>
                      <li style={{ marginLeft: "40px" }}>
                        <Button
                            icon="search"
                            type="primary"
                            onClick={() => this.onSearchJournal()}
                        >
                          搜索
                        </Button>
                      </li>
                    </ul>
                  </div>
                  <div className="system-table">
                    <Table
                        columns={this.makeColumnsJournal()}
                        dataSource={this.makeDataJournal(this.state.data2)}
                        pagination={{
                            total: this.state.total2,
                            current: this.state.pageNum,
                            pageSize: this.state.pageSize,
                            showQuickJumper: true,
                            showTotal: (total, range) => `共 ${total} 条数据`,
                            onChange: (page, pageSize) =>
                              this.onTablePageChangeJournal(page, pageSize)
                        }}
                    />
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
    );
  }
}

// ==================
// PropTypes
// ==================

Category.propTypes = {
  location: P.any,
  history: P.any,
  actions: P.any,
  citys: P.array // 动态加载的省
};

// ==================
// Export
// ==================
const WrappedHorizontalRole = Form.create()(Category);
export default connect(
  state => ({
    citys: state.sys.citys
  }),
  dispatch => ({
    actions: bindActionCreators(
      { findProductTypeByWhere, onChange, onOk, refundList, refundAuditEgis ,AuditLog,RefundExportList},
      dispatch
    )
  })
)(WrappedHorizontalRole);
