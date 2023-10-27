import React from 'react';
import styles from './.module.css';

type TSearchProps = {
  mode?: 'static' | 'dynamic';
};

export const Search = ({ mode = 'static' }: TSearchProps) => {
  const [value, setValue] = React.useState<string>('');

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value) {
      console.log(value);
    }
  };

  return (
    <form onSubmit={submitHandler} className={styles.search__form}>
      <div className={mode === 'static' ? styles.search__field_static : styles.search__field}>
        <input
          type="text"
          name="request"
          placeholder="Search"
          autoFocus={true}
          autoComplete="off"
          className={mode === 'static' ? styles.search__input_static : styles.search__input}
          value={value}
          onChange={changeHandler}
        />
        <div className={mode === 'static' ? styles.search__clear_static : styles.search__clear} onClick={() => setValue('')}></div>
        {mode !== 'static' ? <input type="submit" value="" className={styles.search__submit} /> : ''}
      </div>
      <button className={styles.search__button}>Start search</button>
    </form>
  );
};