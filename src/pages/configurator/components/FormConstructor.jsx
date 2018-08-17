import React, { Component } from "react";
import { connect } from "react-redux";
import FormDetails from "./FormDetails";
import TableParts from "./TableParts";
import TableRows from "./TableRows";
import TableColumns from "./TableColumns";
import Overview from "./Overview";
import { formCtorExit } from "../store/formCtor/actions";

class FormConstructor extends Component {
  renderRowsAndCols() {
    const { step, tableParts } = this.props;

    return tableParts.allIds.map((id, i) => {
      const part = tableParts.byId[id];
      return (
        <React.Fragment key={id}>
          {step === 2 + i * 2 + 1 && <TableRows part={part} />}
          {step === 2 + i * 2 + 2 && <TableColumns part={part} />}
        </React.Fragment>
      );
    });
  }

  render() {
    const { step, maxSteps, dispatch } = this.props;
    return (
      <div style={{ paddingLeft: "30px" }}>
        {/* {step !== maxSteps && ( */}
          <button
            className="btn btn_quitCtor"
            onClick={() => {
              dispatch(formCtorExit());
            }}
          >
            Выйти из конструктора
          </button>
        {/* )} */}
        {step === 1 && <FormDetails />}
        {step === 2 && <TableParts />}
        {step > 2 && step < maxSteps && this.renderRowsAndCols()}
        {step === maxSteps && <Overview />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const partIds = state.configurator.formCtor.tableParts.allIds;
  return {
    step: state.configurator.formCtor.step,
    maxSteps: partIds.length * 2 + 3, // details+parts+rows+cols+overview
    tableParts: state.configurator.formCtor.tableParts
  };
};

export default connect(mapStateToProps)(FormConstructor);
