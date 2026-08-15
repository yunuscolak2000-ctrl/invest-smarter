import type { CountryOption } from "../types/interview";

type CountryRow = [
  code: string,
  name: string,
  currency: string,
  risk_tier: CountryOption["risk_tier"],
];

/** Mock country reference — ISO 3166-1 alpha-2. Restricted tier is product policy, not legal advice. */
const COUNTRY_ROWS: CountryRow[] = [
  ["AE", "United Arab Emirates", "AED", "standard"],
  ["AR", "Argentina", "ARS", "standard"],
  ["AT", "Austria", "EUR", "standard"],
  ["AU", "Australia", "AUD", "standard"],
  ["AZ", "Azerbaijan", "AZN", "standard"],
  ["BD", "Bangladesh", "BDT", "standard"],
  ["BE", "Belgium", "EUR", "standard"],
  ["BG", "Bulgaria", "EUR", "standard"],
  ["BH", "Bahrain", "BHD", "standard"],
  ["BR", "Brazil", "BRL", "standard"],
  ["BY", "Belarus", "BYN", "restricted"],
  ["CA", "Canada", "CAD", "standard"],
  ["CH", "Switzerland", "CHF", "standard"],
  ["CL", "Chile", "CLP", "standard"],
  ["CN", "China", "CNY", "standard"],
  ["CO", "Colombia", "COP", "standard"],
  ["CU", "Cuba", "CUP", "restricted"],
  ["CZ", "Czechia", "CZK", "standard"],
  ["DE", "Germany", "EUR", "standard"],
  ["DK", "Denmark", "DKK", "standard"],
  ["DZ", "Algeria", "DZD", "standard"],
  ["EG", "Egypt", "EGP", "standard"],
  ["ES", "Spain", "EUR", "standard"],
  ["ET", "Ethiopia", "ETB", "standard"],
  ["FI", "Finland", "EUR", "standard"],
  ["FR", "France", "EUR", "standard"],
  ["GB", "United Kingdom", "GBP", "standard"],
  ["GE", "Georgia", "GEL", "standard"],
  ["GH", "Ghana", "GHS", "standard"],
  ["GR", "Greece", "EUR", "standard"],
  ["HU", "Hungary", "HUF", "standard"],
  ["ID", "Indonesia", "IDR", "standard"],
  ["IE", "Ireland", "EUR", "standard"],
  ["IL", "Israel", "ILS", "standard"],
  ["IN", "India", "INR", "standard"],
  ["IQ", "Iraq", "IQD", "restricted"],
  ["IR", "Iran", "IRR", "restricted"],
  ["IT", "Italy", "EUR", "standard"],
  ["JO", "Jordan", "JOD", "standard"],
  ["JP", "Japan", "JPY", "standard"],
  ["KE", "Kenya", "KES", "standard"],
  ["KP", "North Korea", "KPW", "restricted"],
  ["KR", "South Korea", "KRW", "standard"],
  ["KW", "Kuwait", "KWD", "standard"],
  ["KZ", "Kazakhstan", "KZT", "standard"],
  ["LT", "Lithuania", "EUR", "standard"],
  ["MA", "Morocco", "MAD", "standard"],
  ["MM", "Myanmar", "MMK", "restricted"],
  ["MX", "Mexico", "MXN", "standard"],
  ["MY", "Malaysia", "MYR", "standard"],
  ["NG", "Nigeria", "NGN", "standard"],
  ["NL", "Netherlands", "EUR", "standard"],
  ["NO", "Norway", "NOK", "standard"],
  ["NZ", "New Zealand", "NZD", "standard"],
  ["OM", "Oman", "OMR", "standard"],
  ["PH", "Philippines", "PHP", "standard"],
  ["PK", "Pakistan", "PKR", "standard"],
  ["PL", "Poland", "PLN", "standard"],
  ["PT", "Portugal", "EUR", "standard"],
  ["QA", "Qatar", "QAR", "standard"],
  ["RO", "Romania", "RON", "standard"],
  ["RS", "Serbia", "RSD", "standard"],
  ["RU", "Russia", "RUB", "restricted"],
  ["SA", "Saudi Arabia", "SAR", "standard"],
  ["SD", "Sudan", "SDG", "restricted"],
  ["SE", "Sweden", "SEK", "standard"],
  ["SG", "Singapore", "SGD", "standard"],
  ["SY", "Syria", "SYP", "restricted"],
  ["TH", "Thailand", "THB", "standard"],
  ["TN", "Tunisia", "TND", "standard"],
  ["TR", "Türkiye", "TRY", "standard"],
  ["UA", "Ukraine", "UAH", "standard"],
  ["US", "United States", "USD", "standard"],
  ["UZ", "Uzbekistan", "UZS", "standard"],
  ["VE", "Venezuela", "VES", "restricted"],
  ["VN", "Vietnam", "VND", "standard"],
  ["ZA", "South Africa", "ZAR", "standard"],
];

export const COUNTRIES: CountryOption[] = COUNTRY_ROWS.map(
  ([code, name, currency, risk_tier]) => ({
    code,
    name,
    currency,
    risk_tier,
  })
);

const COUNTRY_BY_CODE = new Map(
  COUNTRIES.map((country) => [country.code, country])
);

/** Frequent IPA / FDI destinations for the mock org. */
const PINNED_COUNTRY_CODES = [
  "TR",
  "PL",
  "DE",
  "AE",
  "VN",
  "MX",
  "US",
  "GB",
  "IN",
  "EG",
] as const;

export const PINNED_COUNTRIES: CountryOption[] = PINNED_COUNTRY_CODES.map(
  (code) => COUNTRY_BY_CODE.get(code)
).filter((country): country is CountryOption => country !== undefined);

export const COUNTRY_SEARCH_OPTIONS = COUNTRIES.map((country) => ({
  code: country.code,
  label: `${country.name} (${country.code})`,
}));

export function getCountry(code: string | null): CountryOption | null {
  if (!code) return null;
  return COUNTRY_BY_CODE.get(code) ?? null;
}

export function isRestrictedCountry(code: string | null): boolean {
  return getCountry(code)?.risk_tier === "restricted";
}
