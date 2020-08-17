import React, { Component } from 'react';

export default class ReadOnlyInput extends Component {
  render() {
    const { description, value } = this.props;

    return (
      <div>
        <label>
          <span>{description} </span>
          <input type='text' readOnly disabled value={value} />
        </label>
      </div>
    );
  }
}
