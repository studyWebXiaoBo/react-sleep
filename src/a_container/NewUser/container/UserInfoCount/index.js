/* 用户管理/用户信息统计 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import P from "prop-types";
import moment from "moment";
import { Motion, spring } from "react-motion";
import "./index.scss";
import tools from "../../../../util/tools"; // 工具
import Echarts from "echarts";
import "./china";
import Power from "../../../../util/power"; // 权限
import { power } from "../../../../util/data";
// ==================
// 所需的所有组件
// ==================

import {
  Form,
  Table,
    Button,
  message,
  DatePicker,
    Radio,
} from "antd";

// ==================
// 本页面所需action
// ==================

import { findUserInfoCount } from "../../../../a_action/shop-action";
// ==================
// Definition
// ==================
const RadioGroup = Radio.Group;
class Manager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}, // 当前页面全部数据
        barType: 0, // 下方分类选的哪一个
      searchType: "", //搜索 - 用户类型
        searchRadio: 0, // 当前radio选择的哪一个
        searchBeginTime: undefined, // 开始日期
        searchEndTime: undefined,   // 结束日期
    };
      this.echartsDom1 = null; // Echarts实例
      this.echartsDom2 = null; // Echarts实例
  }

  componentDidMount() {
      // Echarts.registerMap('china', China);
      setTimeout(() => {
          const dom1 = Echarts.init(document.getElementById("echarts-1"));
          const dom2 = Echarts.init(document.getElementById("echarts-2"));
          this.echartsDom1 = dom1;
          this.echartsDom2 = dom2;
          dom1.setOption(this.makeOption1(this.state.data, this.state.barType), true);
          dom2.setOption(this.makeOption2(this.state.data), true);
          window.onresize = () => {
              dom1.resize();
              dom2.resize();
          };
          this.onGetData();
      }, 16);
  }

  componentWillReceiveProps(nextP) {

  }

    componentWillUpdate(nextP, nextS) {
      if(nextS.data !== this.state.data || nextS.barType !== this.state.barType) {
          if(this.echartsDom1) {
              this.echartsDom1.setOption(this.makeOption1(nextS.data,  nextS.barType), true);
          }
          if (this.echartsDom2) {
              this.echartsDom2.setOption(this.makeOption2(nextS.data), true);
          }
      }
    }

  // bar选择
    barChose(id) {
      this.setState({
          barType:  id,
      });
    }

  /** echarts1 构建 **/
    makeOption1(data, barType) {
        // 处理当前选中哪一个
        let visualMap_max = 200;    // 地图空间（多，少）的最大值，留点余量
        let seriesData = [];
        let titleText;
        let allnum = 0;
        switch(barType){
            case 0:
                visualMap_max = data.distributorCount;
                seriesData = data.bdbyCount;
                titleText = '经销商绑定分布情况';
                allnum = data.distributorCount;
                break;
            case 1:
                visualMap_max = data.userSaleCount;
                seriesData = data.bdbyCount;
                titleText = '分销用户发展分布情况';
                allnum = data.userSaleCount;
                break;
            case 2:
                visualMap_max = data.shareCount;
                seriesData = data.bdbyCount;
                titleText = '分享用户发展分布情况';
                allnum = data.shareCount;
                break;
            case 3:
                visualMap_max = data.holderCount;
                seriesData = data.bdbyCount;
                titleText = '经销商优惠卡持有分布情况';
                allnum = data.holderCount;
                break;
            case 4:
                visualMap_max = data.giveCount;
                seriesData = data.bdbyCount;
                titleText = '经销商优惠卡增出分布情况';
                allnum = data.giveCount;
                break;
        }
        visualMap_max = visualMap_max || 200;
      seriesData = seriesData || [];
        const option = {
            title : {
                text: titleText,
                left: 'center',
                top: 'top',
            },
            visualMap: {
                left: 'left',
                min: 0,
                max: Math.max(visualMap_max+100, 200),
                inRange: {
                    color: ['#EAEFFF','#E2EAFF', '#D1DCFF', '#C0D1FF', '#B3C7FF', '#A5BDFF', '#97B2FF','#81A3FF','#7A9EFF', '#5F89FF', '#4A7AFF']
                },
                text:['多','少'],           // 文本，默认为数值文本
                calculable: true
            },
            tooltip: {
                show: true,
                padding: [10, 15],
                backgroundColor: 'rgb(255,255,255)',
                extraCssText: 'box-shadow: 0 0 3px rgba(0,0,0,.3)',
                formatter: (params) => {
                    console.log(params);
                    if(!params.name) {
                        return null;
                    }
                    return `<div class='tooltip'><div>${params.name}</div><div>数量：${params.value} (占比：${allnum === 0 ? '0%' : (params.value/allnum * 100).toFixed(2) + '%'})</div></div>`;
                }
            },
            series: {
                name: '区域分布',
                type: 'map',
                map: 'china',
                roam: 'scale',
                scaleLimit: {
                    min: 1,
                    max: 3
                },
                itemStyle: {
                    areaColor: '#E5E5E5',
                    borderColor: '#fff',
                },
                emphasis: {
                  itemStyle: {
                      areaColor: '#AA9BF0'
                  }
                },
                data: seriesData.map((item) => ({ name: item.disBindProvince.replace('省', ''), value: Number(item.disBindProvinceCount) || 0 }) )
            }

        };
        return option;
    }

    /** 第2个图表处理 **/
    makeOption2(data) {
        const d = data.bindDistributorCount || [];
        const seriesData = d.map((item, index) => {
            return {
                name: item.disBindTime,
                value: [item.disBindTime.replace(/-/g,'/'), item.disBindCount]
            };
        });
        const option = {
            title: {
                text: '新增绑定经销商趋势',
                left: 'center',
                top: 'top',
            },
            tooltip: {
                show: true,
                padding: [10, 15],
                backgroundColor: 'rgb(255,255,255)',
                extraCssText: 'box-shadow: 0 0 3px rgba(0,0,0,.3)',
                formatter: (params) => {
                    console.log('是什么：', params);
                    return `<div class='tooltip'><div>${params.value[0]}</div><div>增长数量：${params.value[1]}</div></div>`;
                }
            },
            xAxis: {
                type: 'time',
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                minInterval: 1,
            },
            series: [{
                name: '趋势数据',
                type: 'line',
                data: seriesData,
            }]
        };
        return option;
    }

  // 查询当前页面所需列表数据
  onGetData() {
      // 处理查询条件
      let beginTime = null;
      let endTime = null;
      const now = new Date();
      const r = this.state.searchRadio;
      if(r !== 0) {
          beginTime = tools.dateToStr(now);
      }
      if(r === 1) { // 7天内
           endTime = tools.dateToStr(new Date(new Date().setDate(now.getDate() + 7)));
      } else if (r === 2) { // 30天内
          endTime = tools.dateToStr(new Date(new Date().setDate(now.getDate() + 7)));
      } else if (r === 3) { // 自定义的时间
          beginTime = this.state.searchBeginTime ? tools.dateToStr(this.state.searchBeginTime._d) : null;
          endTime = this.state.searchEndTime ? tools.dateToStr(this.state.searchEndTime._d) : null;
      }
    const params = {
        beginTime,
        endTime,
    };

    this.props.actions.findUserInfoCount(tools.clearNull(params)).then(res => {
      if (res.status === 200) {
        this.setState({
          data: res.data || {},
        });
      } else {
        message.error(res.message || "获取数据失败，请重试");
      }
    });
  }

  // 搜索
  onSearch() {
    this.onGetData();
  }

  // 工具 - 根据bar选择的得到对应的名字
    getNameByBarId(id) {
        switch(id) {
            case 0: return '经销商绑定总数';
            case 1: return '分销用户发展总数';
            case 2: return '分享用户发展总数';
            case 3: return '经销商优惠卡持有总数';
            case 4: return '经销商优惠卡增出总数';
            default: return '数量';
        }
    }

  // radio改变时触发
    onRadioChange(e) {
      this.setState({
          searchRadio: e.target.value,
      });
    }

    searchBindingBeginTimeChange(e) {
      this.setState({
          searchBeginTime: e,
      });
    }

    searchBindingEndTimeChange(e) {
        this.setState({
            searchEndTime: e,
        });
    }

  render() {
    const me = this;
    const d = this.state.data;
    let list = [];  // 当前分类的数据
    let list2 = d.bindDistributorCount || [];
    let allnum = 1; // 当前分类的总数
    switch(this.state.barType){
        case 0: list = d.bdbyCount || [];allnum=d.distributorCount;break;
        case 1: list = d.bdbyCount || [];allnum=d.userSaleCount;break;
        case 2: list = d.bdbyCount || [];allnum=d.shareCount;break;
        case 3: list = d.bdbyCount || [];allnum=d.holderCount;break;
        case 4: list = d.bdbyCount || [];allnum=d.giveCount;break;
    }

    return (
      <div className="userinfocount-page">
        <div className="system-search">
            <RadioGroup onChange={(e) => this.onRadioChange(e)} value={this.state.searchRadio}>
          <ul className="search-ul">
            <li>
                <Radio value={0}>历史全部</Radio>
            </li>
            <li>
                <Radio value={1}>7日内</Radio>
            </li>
            <li>
                <Radio value={2}>30日内</Radio>
            </li>
            <li>
                <Radio value={3}>时间筛选</Radio>
              <DatePicker
                  disabled={this.state.searchRadio !== 3}
                  format="YYYY-MM-DD"
                  placeholder="开始日期"
                  value={this.state.searchBeginTime}
                  onChange={e => this.searchBindingBeginTimeChange(e)}
              />
              --
              <DatePicker
                  disabled={this.state.searchRadio !== 3}
                  format="YYYY-MM-DD"
                  placeholder="结束日期"
                  value={this.state.searchEndTime}
                  onChange={e => this.searchBindingEndTimeChange(e)}
              />
            </li>
              <li style={{ marginLeft: "5px" }}>
                  <Button
                      icon="search"
                      type="primary"
                      onClick={() => this.onSearch()}
                  >
                      搜索
                  </Button>
              </li>
          </ul>
            </RadioGroup>
        </div>
          <div className="head-tabs">
              <ul>
                  <li className={this.state.barType === 0 ? 'check' : null} onClick={() => this.barChose(0)}>
                      <div>经销商绑定总数</div>
                      <Motion defaultStyle={{ x: 0 }} style={{ x: spring(d.distributorCount || 0) }}>
                          { value => <div>{ Math.round(value.x)}</div> }
                      </Motion>
                  </li>
                  <li className={this.state.barType === 1 ? 'check' : null} onClick={() => this.barChose(1)}>
                      <div>分销用户发展总数</div>
                      <Motion defaultStyle={{ x: 0 }} style={{ x: spring(d.userSaleCount || 0) }}>
                          { value => <div>{ Math.round(value.x)}</div> }
                      </Motion>
                  </li>
                  <li className={this.state.barType === 2 ? 'check' : null} onClick={() => this.barChose(2)}>
                      <div>分享用户发展总数</div>
                      <Motion defaultStyle={{ x: 0 }} style={{ x: spring(d.shareCount || 0) }}>
                          { value => <div>{ Math.round(value.x)}</div> }
                      </Motion>
                  </li>
                  <li className={this.state.barType === 3 ? 'check' : null} onClick={() => this.barChose(3)}>
                      <div>经销商优惠卡持有总数</div>
                      <Motion defaultStyle={{ x: 0 }} style={{ x: spring(d.holderCount || 0) }}>
                          { value => <div>{ Math.round(value.x)}</div> }
                      </Motion>
                  </li>
                  <li className={this.state.barType === 4 ? 'check' : null} onClick={() => this.barChose(4)}>
                      <div>经销商优惠卡赠出总数</div>
                      <Motion defaultStyle={{ x: 0 }} style={{ x: spring(d.giveCount || 0) }}>
                          { value => <div>{ Math.round(value.x)}</div> }
                      </Motion>
                  </li>
              </ul>
              <div className="line" style={{ left: `${this.state.barType * 20}%` }}/>
          </div>
          {/** 上方图表 **/}
          <div className="charts-one">
              <div className="title">区域分布</div>
              <div className="charts-box">
                  <div className="charts" id="echarts-1" />
                  <div className="charts-data">
                      <Table
                          pagination={false}
                          scroll={{ y: 350 }}
                          onRow={(record) => {
                              return {
                                  onMouseOver: () => {  // 鼠标移入行
                                      if (!this.echartsDom1 || !record.sf) return;
                                      this.echartsDom1.dispatchAction({
                                          type: 'showTip',
                                          seriesIndex:0,
                                         name: record.sf.replace('省', ''),
                                      });
                                      this.echartsDom1.dispatchAction({
                                          type: 'highlight',
                                          name: record.sf.replace('省', ''),
                                      });
                                  },
                                  onMouseOut: () => {
                                      if (!this.echartsDom1 || !record.sf) return;
                                      this.echartsDom1.dispatchAction({
                                          type: 'hideTip',
                                      });
                                      this.echartsDom1.dispatchAction({
                                          type: 'downplay',
                                          name: record.sf.replace('省', ''),
                                      });
                                  }
                              };
                          }}
                        columns={[
                            { title: ' ', name: 'source', dataIndex: 'source', width: 80},
                            { title: '省份', name: 'sf', dataIndex: 'sf', width: 80},
                            { title: this.getNameByBarId(this.state.barType), name: 'num', dataIndex: 'num'},
                            { title: this.getNameByBarId(this.state.barType).replace('总数', '占比'), name: 'p', dataIndex: 'p', width: 200},
                        ]}
                        dataSource={
                            (() => {
                                return list.map((item, index) => {
                                    return { key: index, source: index, sf: item.disBindProvince, num: item.disBindProvinceCount, p: allnum === 0 ? '0%' : ((item.disBindProvinceCount / allnum * 100).toFixed(2) + '%') };
                                });
                            })()}
                      />
                  </div>
              </div>
          </div>
          {/** 下方图表 **/}
          <div className="charts-one">
              <div className="title">新增趋势</div>
              <div className="charts-box">
                  <div className="charts" id="echarts-2" />
                  <div className="charts-data">
                      <Table
                          pagination={false}
                          scroll={{ y: 350 }}
                          onRow={(record) => {
                              return {
                                  onMouseOver: () => {  // 鼠标移入行
                                      if (!this.echartsDom2) return;
                                      this.echartsDom2.dispatchAction({
                                          type: 'showTip',
                                          seriesIndex:0,
                                          name: record.date,
                                      });
                                      this.echartsDom2.dispatchAction({
                                          type: 'highlight',
                                          name: record.date,
                                      });
                                  },
                                  onMouseOut: () => {
                                      if (!this.echartsDom2) return;
                                      this.echartsDom2.dispatchAction({
                                          type: 'hideTip',
                                      });
                                      this.echartsDom2.dispatchAction({
                                          type: 'downplay',
                                          name: record.date,
                                      });
                                  }
                              };
                          }}
                          columns={[
                              { title: '日期 ', name: 'date', dataIndex: 'date', width: 150},
                              { title: '新增绑定经销商数', name: 'num', dataIndex: 'num'},
                          ]}
                          dataSource={
                              (() => {
                                  return list2.map((item, index) => {
                                      return { key: index, date: item.disBindTime, num: item.disBindCount };
                                  });
                              })()}
                      />
                  </div>
              </div>
          </div>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

Manager.propTypes = {
  location: P.any,
  history: P.any,
  actions: P.any,
  allRoles: P.any,
  allOrganizer: P.any,
  citys: P.array
};

// ==================
// Export
// ==================
const WrappedHorizontalManager = Form.create()(Manager);
export default connect(
  state => ({
    allRoles: state.sys.allRoles,
    allOrganizer: state.sys.allOrganizer,
    citys: state.sys.citys
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
          findUserInfoCount
      },
      dispatch
    )
  })
)(WrappedHorizontalManager);
