import React from "react";
import ReactTable from "react-table";
import { getObjectsTab } from "./objectsActions";
import { connect } from "react-redux";
import { get, post } from "common/http";
import config from "config/config";
import Icon from "cmp/icon/icon";
import classNames from "classnames";
import CustomNoDataComponent from "cmp/react-table/customNoDataComponent";
import { setTimeout } from "timers";
import ObjectInfo from "./objectInfo";
import InfoDialog from "cmp/dialogs/infoDialog";

class ObjectsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objects: [],
      objectsShortInfo: {},
      activeObjectId: 0,
      activeObjectInfo: {},
      isLoading: false,
      isDetailsVisible: false,
      connectedObjects: []
    };
  }

  componentDidMount() {
    this.loadObjects();
  }

  loadObject = id => {
    return get(config.apiUrl.objects.getObjectInfo + "/" + id, {});
  };

  loadConnectedObjects = (id, connectedTypeIds) => {
    return post(config.apiUrl.objects.getConnectedObjects, { baseObjectId: id, connectedTypeIds: connectedTypeIds });
  };

  loadObjects = () => {
    setTimeout(() => {
      this.setState({
        isLoading: true
      });
    }, 0);

    let data = [];
    const { selectedFilterValues } = this.props;
    for (let code in selectedFilterValues) {
      data.push({
        filterCode: code,
        selectedValues: selectedFilterValues[code]
      });
    }
    const dataToSend = { values: data };
    post(config.apiUrl.objects.getTab, dataToSend).then(res => {
      this.setState({
        objects: res.data,
        isLoading: false
      });
    });
  };

  render() {
    const columns = [
      {
        Header: "Полное наименование",
        accessor: "fullName", // String-based value accessors!
        minWidth: 300
      },
      {
        Header: "Краткое наименование",
        accessor: "shortName", // String-based value accessors!
        minWidth: 300
      },
      {
        Header: "Регион",
        accessor: "region", // String-based value accessors!
        maxWidth: 300,
        width: 300
      }
      // {
      //   Header: "Age",
      //   accessor: "age",
      //   Cell: props => <span className="number">{props.value}</span> // Custom cell components!
      // },
      // {
      //   id: "friendName", // Required because our accessor is not a string
      //   Header: "Friend Name",
      //   accessor: d => d.friend.name // Custom value accessors!
      // },
      // {
      //   Header: props => <span>Friend Age</span>, // Custom header components!
      //   accessor: "friend.age"
      // }
    ];
    const { objects, isLoading, isDetailsVisible } = this.state;
    const cls = classNames({
      ReactTable: true,
      "-striped": true,
      "-highlight": true
    });
    const getTrProps = (state, rowInfo, col, instance) => {
      return {
        onClick: e => {
          const { expanded, objectInfo } = state;
          const path = rowInfo.nestingPath[0];
          //const diff = { [path]: expanded[path] ? false : true };

          const id = rowInfo.original.id;

          this.loadObject(id)
            .then(res => {
              this.setState({
                isDetailsVisible: true,
                // objectsShortInfo: {
                //   ...this.state.objectsShortInfo,
                //   [id]: res.data
                // },
                activeObjectId: id,
                activeObjectInfo: res.data
              });
              return res.data;
            })
            .then(data => {
              this.loadConnectedObjects(id, data.connectedObjectTypeIds).then(res => {
                setTimeout(() => {
                  this.setState({
                    connectedObjects: res.data
                  });
                }, 0);
              });
            });

          // instance.setState({
          //   expanded: {
          //     ...expanded,
          //     ...diff
          //   }
          // });
        }
      };
    };

    const subComponent = row => {
      return <ObjectInfo id={row.original.id} />;
    };
    const { activeObjectInfo, connectedObjects } = this.state;
    return (
      <div className="objects-page">
        <div className="page-header">
          <h1>Список объектов</h1>
        </div>
        <div className="objects-table">
          {/* <div className="object-table__controls">
            <button className="btn">Выгрузить в Excel</button>
          </div> */}
          <div className="objects-table__data">
            <ReactTable
              data={objects}
              manual
              sortable={false}
              loading={isLoading}
              columns={columns}
              defaultPageSize={10}
              showPagination={false}
              minRows={5}
              className={cls}
              noDataText="Нет данных"
              loadingText="Загрузка данных..."
              //noDataComponent={CustomNoDataComponent}
              getTrProps={getTrProps}
              //SubComponent={subComponent}
              freezeWhenExpanded={true}
            />
          </div>
        </div>
        <InfoDialog isVisible={isDetailsVisible}>
          <ObjectInfo data={activeObjectInfo} connectedObjects={connectedObjects} />
        </InfoDialog>
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {
    selectedFilterValues: state.main.selectedFilterValues
  };
};

let mapDispatchToProps = dispatch => {
  return {
    getObjectsTab: selectedFilters => dispatch(getObjectsTab(selectedFilters))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ObjectsPage);
