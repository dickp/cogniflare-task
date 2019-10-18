import React, { Component } from 'react';
import './app.css';

export default class App extends Component {
  state = {
    yaml: null
  };

  componentDidMount() {
    fetch('/api/githubYAML?file=https://github.com/lightheadoc/tripleo/blob/master/net-config-noop.yaml')
      .then(res => res.json())
      .then(data => this.setState({
        yaml: data
      }));
  }

  renderYAML(yaml) {
    return Object.keys(yaml).map((key) => {
      if (!yaml[key]) {
        return '';
      }

      if (typeof yaml[key] !== 'string') {
        return (
          <ul>{this.renderYAML(yaml[key])}</ul>
        );
      }

      return (
        <li>{`${key}: ${yaml[key]}`}</li>
      );
    });
  }

  render() {
    const { yaml } = this.state;
    const yamlElts = yaml
      ? this.renderYAML(yaml)
      : (
        <h1>Loading.. please wait!</h1>
      );

    return (
      <div>
        <ul>{yamlElts}</ul>
      </div>
    );
  }
}
