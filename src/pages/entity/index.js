import React, { Component } from 'react';
import { connect } from 'react-redux';

import dashboard from 'api/dashboard';

function loadEntity(id) {
  return dispatch => {
    dispatch({ type: 'entity/loading' })
    return dashboard.getEntity(id)
      .then(entity => dispatch({ type: 'entity/loaded', entity }))
  };
}

class Entity extends Component {
  componentDidMount() {
    const entityId = parseInt(this.props.match.params.id, 10);
    this.props.dispatch(loadEntity(entityId));
  }
  render() {
    const { loading, data } = this.props;
    if (loading)
      return (
        <div>
          Loading
        </div>
      );
    if (data)
      return (
        <dl>
          {data.attrs.reduce((acc, attr) => acc.concat([
            <dt>{attr.name}</dt>,
            <dd>{attr.value}</dd>
          ]), [])}
        </dl>  
      );
    return (
      <div>Nothing :-(</div>
    );
  }
}

const mapStateToEntityProps = state => {
	return {
		loading: state.entity.loading,
		data: state.entity.data
	};
};

export default connect(mapStateToEntityProps)(Entity);

const initialState = {
  loading: false,
  data: null
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case 'entity/loading':
      return { ...state,
        loading: true
      };
    case 'entity/loaded':
      return { ...state,
        loading: false,
        data: action.entity
      };
    default:
      return state;
 }
}
