import React from "react";
import InfoDialog from "cmp/dialogs/infoDialog";

export default class ReportsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogVisible: false
    };
  }

  onClick = () => {
    const { dialogVisible } = this.state;
    this.setState({ dialogVisible: true });
  };
  render() {
    const { dialogVisible } = this.state;
    return (
      <div>
        <div className="page-header">
          <h1>Отчёты</h1>
        </div>
        {/* <Popup className="dialog-reports-info" isVisible={dialogVisible} isModal={false}>
          Test popup from page
        </Popup> */}
        <InfoDialog className="dialog-reports-info" isVisible={dialogVisible} isModal={false}>
          Test info dialog for reports page
        </InfoDialog>

        {/* <CSSTransition in={dialogVisible} timeout={300} classNames="header" unmountOnExit>
          {state => {
            return <h2>Просто страница отчётов и тест диалога</h2>;
          }}
        </CSSTransition> */}
        <button onClick={this.onClick}>Show dialog</button>
      </div>
    );
  }
}
