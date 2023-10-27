import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    console.log('We did catch', error);
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div>
          <h2>Seems like an error occured!</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>{this.state.error.toString()}</details>
        </div>
      );
    }

    return this.props.children;
  }
}
