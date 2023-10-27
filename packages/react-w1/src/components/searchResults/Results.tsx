import React from 'react';
import { resultFields } from '../../constants/resultFields';

interface Props {
  results: Record<string, string | number>[];
  category?: string;
}

export class SearchResults extends React.Component<Props, Props> {
  constructor(props: Props) {
    super(props);
    if (props.results) this.state = { results: props.results, category: props.category };
  }

  static getDerivedStateFromProps(props: Props) {
    console.log('DerivedState:');
    console.log(props);
    if (props.results.length) return props;
    return null;
  }

  render(): React.ReactNode {
    const cat = this.state.category as keyof typeof resultFields;
    if (this.state.results.length && cat !== undefined)
      return (
        <table>
          <thead>
            <tr>
              {resultFields[cat].map((n, i) => (
                <td key={i}>{n}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.state.results.map((field, i) => {
              return (
                <tr key={i}>
                  {resultFields[cat].map((n, i) => {
                    return <td key={i}>{field[n].toString()}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    return null;
  }
}
