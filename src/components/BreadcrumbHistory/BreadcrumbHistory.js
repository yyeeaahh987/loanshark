import React, { Component } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  Row,
  Col,
} from "reactstrap";
import uuid from "uuid/v4";

class BreadcrumbHistory extends Component {
  state = {
    date: "15 Jan 2020",
  };
  renderBreadCrumbs = () => {
    let route = this.props.url
      .split("/")
      .slice(1)
      .slice(1)
      .map((route) =>
        route
          .split("-")
          .map((word) => word[0].toUpperCase() + word.slice(1))
          .join(" ")
      );
    const length = route.length;
    return route.map((item, index) =>
      length === index + 1 ? (
        <BreadcrumbItem key={uuid()} className={"active"}>
          {item}
        </BreadcrumbItem>
      ) : (
        <BreadcrumbItem key={uuid()}>{item}</BreadcrumbItem>
      )
    );
  };

  render() {
    return (
      <>
        {this.props.url !== "/app/chat" ? (
          <Row noGutters>
            <Col lg={10}>
              <Breadcrumb tag="nav" listTag="div">
                {this.renderBreadCrumbs()}
              </Breadcrumb>
            </Col>
          </Row>
        ) : null}
      </>
    );
  }
}

export default BreadcrumbHistory;
