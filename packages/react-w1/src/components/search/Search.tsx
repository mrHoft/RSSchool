import React from 'react';
import styles from './.module.css';
import Store from '../../store/Store';

const store = new Store();

interface SearchProps {
  callback: (query: string) => void;
}

interface SearchState {
  callback: (query: string) => void;
  value: string;
}

export class Search extends React.Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    this.state = { ...props, value: '' };
  }

  componentDidMount(): void {
    let lastSearch = store.get('lastSearch');
    if (typeof lastSearch !== 'string') lastSearch = '';
    else
      this.setState((props) => {
        return { ...props, value: lastSearch as string };
      });
  }

  private changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState((props) => {
      return { ...props, value: event.target.value };
    });
  };

  private submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.target as HTMLFormElement);
    const value = String(form.get('request'));
    if (value) {
      store.set('lastSearch', value);
    }
    this.state.callback(value);
  };

  render() {
    return (
      <>
        <form onSubmit={this.submitHandler} className={styles.search__form}>
          <div className={styles.search__field_static}>
            <input
              type="text"
              name="request"
              placeholder="Search"
              autoFocus={true}
              autoComplete="off"
              className={styles.search__input_static}
              value={this.state.value}
              onChange={this.changeHandler}
            />
            <div
              className={styles.search__clear_static}
              onClick={() =>
                this.setState((props) => {
                  return { ...props, value: '' };
                })
              }></div>
          </div>
          <button className={styles.search__button}>Start search</button>
        </form>
      </>
    );
  }
}
