import React, { Component } from "react";
import ReactTable from "react-table";
import classNames from "classnames";
import api from "../../api/dataCollector";
import ModalForm from "../configurator/components/ModalForm";
import CampaignInfo from "./CampaignInfo";

export default class CampaignList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      campaigns: [],
      isLoading: false,
      filter: {
        activeOnly: true,
        subs: null
      },
      activeCampaign: null,
      error: null
    };

    this.refreshData = this.refreshData.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.toggleActiveCampaign = this.toggleActiveCampaign.bind(this);
  }

  componentDidMount() {
    this.refreshData();
  }

  refreshData() {
    this.setState({ isLoading: true }, () => {
      api
        .getCampaigns(
          null,
          this.state.filter.subs,
          this.state.filter.activeOnly,
          null
        )
        .then(data => {
          this.setState({ campaigns: data, isLoading: false });
        })
        .catch(error => {
          this.setState({ error: error.message, isLoading: false });
        });
    });
  }

  dateToString(time) {
    const date = new Date(time);
    const addZero = num => ("0" + num.toString()).slice(-2);
    return (
      addZero(date.getDate()) +
      "." +
      addZero(date.getMonth() + 1) +
      "." +
      date.getFullYear().toString()
    );
  }

  handleFilterChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    this.setState(
      {
        filter: { ...this.state.filter, [target.name]: value }
      },
      () => {
        this.refreshData();
      }
    );
  }

  toggleActiveCampaign(campaign = null) {
    this.setState({ activeCampaign: campaign });
  }

  render() {
    const columns = [
      {
        Header: "ID",
        accessor: "id",
        maxWidth: 100
      },
      {
        Header: "Наименование",
        accessor: "name"
      },
      {
        Header: "Начало",
        accessor: "startDate",
        maxWidth: 110 //,Cell: row => <div>{this.dateToString(Date.parse(row.value))}</div>
      },
      {
        Header: "Окончание",
        accessor: "endDate",
        maxWidth: 110 //,Cell: row => <div>{this.dateToString(Date.parse(row.value))}</div>
      },
      {
        Header: "Тип календаря",
        accessor: "calType",
        maxWidth: 200
      },
      {
        Header: "Описание",
        accessor: "description"
      }
    ];
    const { campaigns, isLoading, activeCampaign } = this.state;
    const cls = classNames({
      ReactTable: true,
      "-striped": true,
      "-highlight": true
    });
    const getTrProps = (state, rowInfo, col, instance) => {
      return {
        onClick: e => {
          this.setState({ activeCampaign: rowInfo.original });
        }
      };
    };
    return (
      <div style={{ padding: "20px" }}>
        <h3>Кампании</h3>
        <div>
          <label>Только активные</label>
          <input
            type="checkbox"
            name="activeOnly"
            disabled={this.state.isLoading}
            checked={this.state.filter.activeOnly}
            onChange={this.handleFilterChange}
          />
        </div>
        {/* <div>
          <label>Включать подчиненные</label>
          <input
            type="checkbox"
            name="subs"
            disabled={this.state.isLoading}
            checked={this.state.filter.subs}
            onChange={this.handleFilterChange}
          />
        </div> */}
        {this.state.error && (
          <div>Ошибка загрузки данных: {this.state.error}</div>
        )}
        <ReactTable
          data={campaigns}
          manual
          sortable={false}
          loading={isLoading}
          columns={columns}
          showPagination={false}
          minRows={3}
          className={cls}
          noDataText="Нет данных"
          loadingText="Загрузка данных..."
          getTrProps={getTrProps}
        />
        <ModalForm
          isShown={!!activeCampaign}
          onOverlayClick={() => this.toggleActiveCampaign()}
        >
          <CampaignInfo
            campaign={activeCampaign}
            onOKClick={() => this.toggleActiveCampaign()}
          />
        </ModalForm>
      </div>
    );
  }
}
