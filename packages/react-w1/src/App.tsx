import React from 'react';
import { Search } from './components/search/Search';
import { Request } from './api/Request';
import { SearchResults } from './components/searchResults/Results';
import { ErrorComponent } from './components/ErrorComponent';

interface State {
  status?: string;
  count?: number;
  results: Record<string, string | number>[];
  category?: string;
  throwError: boolean;
}

class App extends React.Component {
  state: State = {
    status: `Use one of folowing: "people", "planets", "films", "species", "vehicles", "starships"`,
    results: [],
    throwError: false,
  };

  constructor(props = {}) {
    super(props);
    this.updateState = this.updateState.bind(this);
  }

  componentDidMount(): void {
    console.log('Main page first mount');
  }

  updateState(query: string) {
    this.setState({ status: `Searching for "${query}"...` });
    Request(query)
      .then((response) => {
        this.setState(() => {
          return { status: undefined, ...response, category: query };
        });
      })
      .catch((err) => console.warn(err));
  }

  render() {
    return (
      <>
        <div>
          <Search callback={this.updateState.bind(this)} />
        </div>
        <div>
          {this.state.status ? <p>{this.state.status}</p> : null}
          {this.state.count ? <p>Total: {this.state.count}</p> : null}
          <SearchResults results={this.state.results} category={this.state.category} />
        </div>
        <div className="align_center">
          <button
            onClick={() => {
              this.setState((prev) => ({ ...prev, throwError: true }));
            }}>
            Throw Error
          </button>
        </div>
        {this.state.throwError ? <ErrorComponent /> : null}
      </>
    );
  }
}

export default App;
