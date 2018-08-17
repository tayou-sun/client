import React, { Component } from "react";
import FormListItem from "./FormListItem";

class FormList extends Component {
  render() {
    const { orgId, forms, onSelectForm } = this.props;
    if (!forms || orgId === null) return null;
    return (
      <div className="formList">
        <button
          className="btn btn-outline-success btn-addForm"
          onClick={() => {
            onSelectForm(0);
          }}
        >
          Создать
        </button>
        <div className="cardsContainer">
          {forms.map(form => (
            <FormListItem
              key={form.id}
              period={form.period}
              {...form}
              onClick={() => {
                onSelectForm(form.id);
              }}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default FormList;
