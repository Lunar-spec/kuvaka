import { create } from 'zustand'
import type { CountryState, Country } from '@/types/auth'

export const useCountryStore = create<CountryState>()((set, get) => ({
    countries: [],
    loading: false,
    error: null,

    fetchCountries: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag')
            const data = await response.json()

            const countries: Country[] = data
                .filter((country: any) => country.idd?.root && country.idd?.suffixes)
                .map((country: any) => ({
                    name: country.name.common,
                    code: country.cca2,
                    dialCode: country.idd.root + (country.idd.suffixes[0] || ''),
                    flag: country.flag
                }))
                .sort((a: Country, b: Country) => a.name.localeCompare(b.name))

            set({ countries, loading: false })
        } catch (error) {
            set({ error: 'Failed to fetch countries', loading: false })
        }
    },

    getCountryByCode: (code) => {
        const { countries } = get()
        return countries.find(country => country.code === code) || null
    }
}))