import React, { Component } from "react";
// import { connect } from "react-redux";
import ReactTable from "react-table";
import api from "../../api/dataCollector";
import { Link } from "react-router-dom";
// import { refreshForms } from "./store/forms/actions";

export default class CampaignInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: null,
      error: null
    };
  }

  componentDidMount() {
    api
      .getCampaignInfo(this.props.campaign.id)
      .then(response => {
        if (response.error) throw new Error(response.error);
        this.setState({ data: response, isLoading: false });
        return response;
      })
      // .then(forms => {
      //   const result = {};
      //   forms.FORMS.forEach(form => {
      //     result[form.FORM_ID] = form;
      //   });
      //   this.props.dispatch(refreshForms(result));
      // })
      .catch(error => {
        this.setState({ isLoading: false });
        //alert(error.message);
        this.setState({ error: error.message, isLoading: false });
      });
  }

  renderData(data) {
    if (!data) return null;
    const props = data.Props || [];
    const forms = data.FORMS || [];
    const columns = [
      { Header: "Наименование", accessor: "FORM_NAME" },
      { Header: "Период", accessor: "FORM_PERIOD" },
      {
        Header: "",
        accessor: "FORM_ID",
        Cell: row => (
          <Link
            to={`/campaigns/${this.props.campaign.id}/forms/${row.value}`}
            target="_blank"
          >
            Редактировать
          </Link>
        )
      }
    ];
    return (
      <div>
        <div className="object-info" style={{ width: "700px" }}>
          {props ? (
            props.map((prop, i) => (
              <div key={i} className="object-prop">
                <div className="object-prop__title" style={{ width: "60%" }}>
                  {prop.Name}
                </div>
                <div className="object-prop__value" style={{ width: "40%" }}>
                  {prop.Value}
                </div>
              </div>
            ))
          ) : (
            <div>Свойства не найдены</div>
          )}
        </div>
        <h5>Формы</h5>
        <ReactTable
          data={forms}
          manual
          sortable={false}
          loading={this.state.isLoading}
          columns={columns}
          showPagination={false}
          minRows={3}
          noDataText="Нет данных"
          loadingText="Загрузка данных..."
          //getTrProps={getTrProps}
        />
      </div>
    );
  }

  render() {
    const campaign = this.props.campaign;
    const { data, error, isLoading } = this.state;
    if (isLoading) return <div>Загрузка...</div>;
    // if (!data) return null;
    // if (!data && !error) return null;
    return (
      <div>
        {error && (
          <div>
            <div>Кампания: {campaign.name}</div>
            <div>Ошибка загрузки данных: {error}</div>
          </div>
        )}
        {this.renderData(data)}
        <button type="button" className="btn" onClick={this.props.onOKClick}>
          OK
        </button>
      </div>
    );
  }
}

//export default connect()(CampaignInfo);

/* <div style={{ width: "300px", height: "300px" }}>Загрузка...</div> */
