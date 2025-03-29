import React, { useMemo } from 'react';
import Select from 'react-select';
import { Country, City } from 'country-state-city';

interface CountryOption {
  value: string;
  label: string;
}

interface CityOption {
  value: string;
  label: string;
}

interface CountrySelectProps {
  selectedCountry: string;
  selectedCity: string;
  onCountryChange: (country: string) => void;
  onCityChange: (city: string) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  selectedCountry,
  selectedCity,
  onCountryChange,
  onCityChange
}) => {
  const countries = useMemo(() => 
    Country.getAllCountries().map(country => ({
      value: country.isoCode,
      label: country.name
    })), []
  );

  const cities = useMemo(() => {
    if (!selectedCountry) return [];
    const citiesData = City.getCitiesOfCountry(selectedCountry);
    return citiesData?.map(city => ({
      value: city.name,
      label: city.name
    })) || [];
  }, [selectedCountry]);

  const handleCountryChange = (option: CountryOption | null) => {
    const countryValue = option?.value || '';
    onCountryChange(countryValue);
    if (!option) {
      onCityChange('');
    }
  };

  const handleCityChange = (option: CityOption | null) => {
    onCityChange(option?.value || '');
  };

  const selectedCountryOption = countries.find(country => country.value === selectedCountry);
  const selectedCityOption = cities.find(city => city.value === selectedCity);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country
        </label>
        <Select<CountryOption>
          value={selectedCountryOption}
          onChange={handleCountryChange}
          options={countries}
          className="basic-select"
          classNamePrefix="select"
          placeholder="Select a country"
          isClearable
          isSearchable
          styles={{
            control: (base) => ({
              ...base,
              minHeight: '42px',
              borderColor: '#D1D5DB',
              '&:hover': {
                borderColor: '#9CA3AF'
              }
            }),
            placeholder: (base) => ({
              ...base,
              color: '#6B7280'
            })
          }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          City
        </label>
        <Select<CityOption>
          value={selectedCityOption}
          onChange={handleCityChange}
          options={cities}
          className="basic-select"
          classNamePrefix="select"
          placeholder={selectedCountry ? "Select a city" : "Select a country first"}
          isClearable
          isSearchable
          isDisabled={!selectedCountry}
          noOptionsMessage={() => 
            !selectedCountry 
              ? "Select a country first" 
              : cities.length === 0 
              ? "No cities available for this country" 
              : "No cities found"
          }
          styles={{
            control: (base) => ({
              ...base,
              minHeight: '42px',
              borderColor: '#D1D5DB',
              '&:hover': {
                borderColor: '#9CA3AF'
              }
            }),
            placeholder: (base) => ({
              ...base,
              color: '#6B7280'
            })
          }}
        />
      </div>
    </div>
  );
};

export default CountrySelect;