import React from "react";
import { NavLink } from "react-router-dom";
import TableCell from './TableCell.js';
export default class Tableq extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      cells :[],
      clickedCell : []
    };

    this.createHeader = this.createHeader.bind(this);
    this.genRow = this.genRow.bind(this);
  }

    render() {
        return (
          <table className="table table-bordered">
            <thead>
            {this.genRow()}
            </thead>
          </table>          
        );
      }

      handleClick = (event) => {

        var a ;
        for (var i = 0 ; i < this.props.headers.length;i++){
          if (((this.props.headers[i])[0]).cell == event.target){
            a = this.props.headers[i];
          }
        }
        // access to e.target here
        this.props.onRef(a)
        this.setState({ clickedCell: event.target})
      }

      getValue(){
        //console.log(this.state.sampleString);
        return this.state.clickedCell
      }

      createHeader(value, isFirst){
          var headers = this.props.headers;
          var _rows = [];
          var _tds = [];

          var j =0;
          var currentLevel = 0;
          for (var i = 0; i < headers.length; i++){

            var td = <td  key={'td' + j} onClick = {((e) => this.handleClick(e))}>s
            {headers[i].map(a => a.name)}

          </td>;
            _tds.push(td );

            ((headers[i])[0]).cell = td;
              j++;
          }

          

          return <tr>{_tds}</tr>;
        }
      
      genRow() {
        
        var value = this.props.value;
        var isChild = this.props.isChild;
        let newTableCell = this.state.cells
        return this.createHeader(value, newTableCell.length == 0);
      }
    
    }