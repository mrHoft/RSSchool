import React from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Search } from './components/search/Search';

class App extends React.Component {
  componentDidMount(): void {
    console.log('Main page first mount');
  }

  render(): JSX.Element {
    return (
      <ErrorBoundary>
        <div>
          <Search />
        </div>
        <div>
          <button
            onClick={() => {
              throw new Error('Test Error');
            }}>
            Throw Error
          </button>
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
