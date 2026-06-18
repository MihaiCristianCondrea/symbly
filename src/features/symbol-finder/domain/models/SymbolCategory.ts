export type SymbolCategory =
  | 'Currency'
  | 'Arrows'
  | 'Math'
  | 'Legal'
  | 'Checkmarks'
  | 'Punctuation'
  | 'Quotes'
  | 'Bullets'
  | 'Units'
  | 'Greek'
  | 'Programming';

export type SymbolFilterCategory =
  | 'Popular'
  | 'Currency'
  | 'Arrows'
  | 'Math'
  | 'Punctuation'
  | 'Legal'
  | 'Checkmarks'
  | 'Greek'
  | 'Developer'
  | 'All';

export const symbolCategories: SymbolCategory[] = [
  'Currency',
  'Arrows',
  'Math',
  'Legal',
  'Checkmarks',
  'Punctuation',
  'Quotes',
  'Bullets',
  'Units',
  'Greek',
  'Programming',
];

export const symbolFilterCategories: SymbolFilterCategory[] = [
  'Popular',
  'Currency',
  'Arrows',
  'Math',
  'Punctuation',
  'Legal',
  'Checkmarks',
  'Greek',
  'Developer',
  'All',
];
