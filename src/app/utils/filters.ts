interface FiltersProps<T> {
  fields: (keyof T)[];
  data: T[];
  query: string;
}

export function filters<T>({ fields, data, query }: FiltersProps<T>): T[] {
  if (!query.trim()) return data;

  const lowerQuery = query.toLowerCase();

  return data.filter((item) =>
    fields.some((field) =>
      String(item[field]).toLowerCase().includes(lowerQuery)
    )
  );
}
