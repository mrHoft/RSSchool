type TBrand = { brand: string; models: string[] };

const URL_BRANDS = './brands.json';
const defaultBrands = [{ brand: 'Renault', models: ['Captur'] }];

const getRandomCarName = () => {
  let brands: TBrand[] | null = null;

  const getName = () => {
    if (brands) {
      const item = brands[Math.floor(Math.random() * brands.length)];
      const model = item.models[Math.floor(Math.random() * item.models.length)];
      return `${item.brand} ${model}`;
    }
    return `${defaultBrands[0].brand} ${defaultBrands[0].models[0]}`;
  };

  return new Promise<string>(resolve => {
    if (brands) resolve(getName());
    fetch(URL_BRANDS, { method: 'GET', headers: { Accept: 'application/json' } })
      .then(response => response.json())
      .then((data: unknown) => {
        brands = data as TBrand[];
        resolve(getName());
      })
      .catch(() => resolve(getName()));
  });
};

export default getRandomCarName;
