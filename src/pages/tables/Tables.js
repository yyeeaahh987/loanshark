import React from "react";
import {
  Row,
  Col,
  Table,
  Progress,
  Button,
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Input,
  Label,
  Badge
} from "reactstrap";
import { Sparklines, SparklinesBars } from "react-sparklines";

import Widget from "../../components/Widget";
import Trade from "../../components/Trade";
import s from "./Tables.modules.scss";
import ReactEchartsCore from "echarts-for-react/lib/core";
import echarts from "echarts/lib/echarts";
import {chartData} from "../charts/mock";

class Tables extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    cd: chartData,
    initEchartsOptions: {
      renderer: 'canvas'
    },
  }

  parseDate(date) {
    this.dateSet = date.toDateString().split(" ");

    return `${date.toLocaleString("en-us", { month: "long" })} ${
      this.dateSet[2]
    }, ${this.dateSet[3]}`;
  }

  checkAll(ev, checkbox) {
    const checkboxArr = new Array(this.state[checkbox].length).fill(
      ev.target.checked
    );
    this.setState({
      [checkbox]: checkboxArr
    });
  }

  changeCheck(ev, checkbox, id) {
    //eslint-disable-next-line
    this.state[checkbox][id] = ev.target.checked;
    if (!ev.target.checked) {
      //eslint-disable-next-line
      this.state[checkbox][0] = false;
    }
    this.setState({
      [checkbox]: this.state[checkbox]
    });
  }

  render() {
    const { cd, initEchartsOptions } = this.state
    return (
      <div className={s.root}>
        <Row>
          <Col lg={6}>
            <Widget
              title={<p style={{ fontWeight: 700 }}>Borrow</p>}
              customDropDown
            >
              <Trade/>
            </Widget>
          </Col>
          <Col lg={6}>
            <Widget
                title={<p style={{ fontWeight: 700 }}>Health Factor</p>}
                customDropDown
            >
              <ReactEchartsCore
                  echarts={echarts}
                  option={cd.echarts.donut}
                  opts={initEchartsOptions}
              />
              <Table>

              </Table>
            </Widget>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Tables;
