import React, { Component } from 'react';
import './app.css';

export default class App extends Component {
  state = {
    yaml: null,
    url: ''
  };

  componentDidMount() {
  }

  handleURLChange(event) {
    const url = event.target.value;

    this.setState({
      url
    });
  }

  handleOnClick() {
    const { url } = this.state;

    fetch(`/api/githubYAML?file=${url}`)
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
    const { yaml, url } = this.state;

    const yamlElts = yaml
      ? this.renderYAML(yaml)
      : (
        <h1>
          Enter a URL to a YAML file on GitHub:
          <input type="text" value={url} onChange={this.handleURLChange.bind(this)} />
          <button type="button" onClick={this.handleOnClick.bind(this)}>
            Fetch
          </button>
        </h1>
      );

    return (
      <div>
        <ul>{yamlElts}</ul>
      </div>
    );
  }
}
