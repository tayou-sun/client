import React from "react";
import { NavLink } from "react-router-dom";
import Tableq from "./Tableq";
import TableCell from "./TableCell.js"

export default class TableManagement extends React.Component {

    constructor(props) {
      super(props);
      
      this.state = {
        headers: [],
        value: '',
        isChild: false,
        ckickedCell : []
      };

      this.AddRow = this.AddRow.bind(this);
      this.AddChildRow = this.AddChildRow.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }  
  
    AddRow() { 
      let newHeader = this.state.headers;
      var tableCell = new TableCell (this.state.value, false, 0, 0);
      newHeader.push([tableCell]);
      this.setState({headers: newHeader});
    }

    AddChildRow(){
        if (this.clickedCell != undefined){
            let newHeader = this.state.headers;
            var tableCell = new TableCell (this.state.value,this.clickedCell, 0, 0);
            newHeader.push([tableCell]);
            this.setState({headers: newHeader})
        }

    }
    handleChange(event) {
       this.setState({value: event.target.value});
    }

    render() {
      return (
        <div>
            <div>
                <input type="text"
                    placeholder="Hello!"
                    value={this.state.value}
                    onChange={this.handleChange} />
                <a className = "btn btn-primary mb-2" onClick={this.AddRow}>Добавить на текущий уровень</a>
                <a className = "btn btn-primary mb-2" onClick={this.AddChildRow}>Добавить дочерний элемент</a>
            </div>
            <Tableq headers={this.state.headers}  onRef={ref => (this.clickedCell = ref)} onChange={this.props.ckickedCell}/>/>
        </div>
        );
    }
}