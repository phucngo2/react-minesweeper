export type EnumRecord<TKey extends string> = {
  [K in TKey]: K;
};
