export class SWApi {
  private url = 'https://swapi.dev/api/';

  public async get(category: string) {
    return fetch(`${this.url}${category}`)
      .then((response) => response.json())
      .then((obj) => {
        if (!obj) {
          return new Error('Search failed (code: 500)');
        }
        return obj as Record<string, unknown>;
      })
      .catch((err: Error) => {
        return { status: err.message };
      });
  }
}
