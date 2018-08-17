import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { getFilters, hideSidebar, showSidebar, expandFilter, collapseFilter } from "./homeActions";
import { Map, Marker, Popup, TileLayer, ZoomControl } from "react-leaflet";
import Sidebar from "cmp/sidebar/sidebar";
import FilterPanel from "cmp/filters/FilterPanel";
import MapControl from "cmp/mapControls/mapControl";
import FaFilter from "react-icons/lib/fa/filter";

import "node_modules/leaflet/dist/leaflet.css";
import "node_modules/leaflet/dist/images/marker-icon.png";
import "node_modules/leaflet/dist/images/marker-shadow.png";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 55.707618,
      lng: 37.688467,
      zoom: 13
    };
  }

  componentDidMount() {}
  onClick = e => {
    e.preventDefault();
    this.toggleSidebar();
  };

  toggleSidebar() {
    if (this.props.isFilterPanelActive) {
      this.props.hideSidebar();
    } else {
      this.props.showSidebar();
    }
  }
  onFilterToggle = (id, expanded) => {
    if (expanded) {
      this.props.expandFilter(id);
    } else {
      this.props.collapseFilter(id);
    }
  };

  render() {
    const pos = [this.state.lat, this.state.lng];

    // let posts = this.props.posts.map(item => {
    //   return (
    //     <div key={item.id} className="post">
    //       <a href={item.html_url}>{item.login}</a>
    //       <hr />
    //     </div>
    //   );
    // });

    // return <div id="blog">{posts}</div>;

    return (
      <div className="home-page">
        <FilterPanel onFilterToggle={this.onFilterToggle} />
        <div className="map">
          <div className="map-controls">
            <MapControl onClick={this.onClick}>
              <FaFilter className="icon" size={25} />
            </MapControl>
          </div>
          <Map center={pos} zoom={this.state.zoom} zoomControl={false}>
            <ZoomControl position="topright" />
            <TileLayer
              attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            />
            <Marker position={pos}>
              <Popup>
                <span>
                  A pretty CSS3 popup.<br />Easily customizable.
                </span>
              </Popup>
            </Marker>
          </Map>
        </div>
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {
    filters: state.filters,
    error: state.error,
    isFilterPanelActive: state.sidebar.isActive
  };
};

let mapDispatchToProps = dispatch => {
  return {
    getFilters: () => dispatch(getFilters()),
    hideSidebar: () => dispatch(hideSidebar()),
    showSidebar: () => dispatch(showSidebar()),
    expandFilter: id => dispatch(expandFilter(id)),
    collapseFilter: id => dispatch(collapseFilter(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
