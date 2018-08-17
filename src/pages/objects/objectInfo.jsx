import React, { Component } from "react";
import { get, post } from "common/http";
import config from "config/config";
import classNames from "classnames";
import _ from "lodash";
import Expandable from "cmp/expandable/expandable";
import { DH_NOT_SUITABLE_GENERATOR } from "constants";
import { NavLink } from "react-router-dom";

class ObjectInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      connectedObjects: []
    };
  }

  componentDidMount() {
    const { id, data, connectedObjects } = this.props;
    if (id) {
      this.loadObject(id).then(res =>
        this.setState({
          data: res.data
        })
      );
      //this.loadConnectedObjects(id, connectedObjectsTypeIds);
    } else if (data) {
      this.setState({
        data: data,
        connectedObjects: connectedObjects
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.connectedObjects) {
      this.setState({
        connectedObjects: nextProps.connectedObjects
      });
    }
  }

  loadObject = id => {
    return get(config.apiUrl.objects.getObjectInfo, { id: id });
  };

  render() {
    const { data, connectedObjects } = this.state;
    const objPageLink = "/entity/" + data.id;
    if (data.props) {
      const rows = _.sortBy(data.props, x => x.order).map((x, index) => {
        if (x.isHeader) {
          return (
            <div className="object-prop__header" key={index}>
              {x.name}
            </div>
          );
        } else {
          return (
            <div className="object-prop" key={index}>
              <div className="object-prop__title">{x.name}</div>
              <div className="object-prop__value">{x.value}</div>
            </div>
          );
        }
      });

      let objects = null;
      if (connectedObjects) {
        objects = connectedObjects.map((x, index) => {
          const headers = _.flatten(_.sortBy(x.metadata, item => item.order), true);
          let items = [];
          const data = x.data.map(item => {
            let res = {};
            item.propData.map(p => (res[p.columnCode] = p.value));
            items.push(res);
          });
          return (
            <div className="connected-objects" key={index}>
              <table className="table striped connected-objects-table">
                <thead>
                  <tr>
                    {headers.map((header, index) => {
                      return <td key={index}>{header.columnName}</td>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => <tr key={index}>{headers.map((header, index) => <td key={index}>{item[header.columnCode]}</td>)}</tr>)}
                </tbody>
              </table>
            </div>
          );
        });
      }

      return (
        <div>
          <div className="object-info">
            <div className="object-info__data">{rows}</div>
          </div>
          {objects}
          <div className="object-info__links">
            <NavLink className="header__menu-link" exact to={objPageLink}>
              Перейти на карточку объекта
            </NavLink>
          </div>
        </div>
      );
    }
    return <div />;
  }
}

export default ObjectInfo;
