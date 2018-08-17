import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

//import './app.css';

import Header from "components/layout/header/header";
import Footer from "components/layout/footer/footer";
import { getFilters } from "pages/home/homeActions";

import Home from "pages/home/home";
import ObjectsPage from "pages/objects/objects";
import IndicatorsPage from "pages/indicators/indicators";
import ReportsPage from "pages/reports/reports";
import Entity from "pages/entity";
import Configurator from "pages/configurator";
import DataCollector from "pages/data-collector";
import CampaignList from "pages/data-collector/CampaignList";
import DataEntry from "pages/data-collector/DataEntry";

import "node_modules/font-awesome/less/font-awesome.less";
import "node_modules/react-table/react-table.css";
import "node_modules/react-virtualized-select/styles.css";
import "react-select/dist/react-select.css";

class App extends Component {
  componentDidMount() {
    this.props.getFilters();
  }

  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <Header />
          <div className="content">
            <div className="page-content">
              <Switch>
                <Route path="/objects" component={ObjectsPage} />
                <Route path="/indicators" component={IndicatorsPage} />
                <Route path="/reports" component={ReportsPage} />
                <Route path="/entity/:id" component={Entity} />
                <Route path="/configurator" component={Configurator} />
                <Route path="/campaigns" component={CampaignList} exact />
                <Route path="/data-collector" component={DataCollector} />
                <Route path="/campaigns/:campaignId/forms/:formId" component={DataEntry} />
                <Route path="/" component={Home} />
              </Switch>
            </div>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {};
};
const mapDispatchToProps = dispatch => {
  return {
    getFilters: data => dispatch(getFilters(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
