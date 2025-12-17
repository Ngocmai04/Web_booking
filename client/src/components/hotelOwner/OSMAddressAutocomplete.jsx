import React, { useEffect, useRef, useState } from 'react'

const getCityFromNominatimAddress = (address = {}) =>
    address.city ||
    address.town ||
    address.village ||
    address.county ||
    address.state ||
    address.region ||
    ''

const OSMAddressAutocomplete = ({
    value,
    onChange,
    onSelect,
    placeholder = 'Search address (OpenStreetMap)',
    disabled = false,
}) => {
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const abortRef = useRef(null)
    const debounceRef = useRef(null)

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        if (abortRef.current) abortRef.current.abort()

        const q = (value || '').trim()
        if (q.length < 3) {
            setResults([])
            setIsLoading(false)
            setIsOpen(false)
            return
        }

        debounceRef.current = setTimeout(async () => {
            const controller = new AbortController()
            abortRef.current = controller
            setIsLoading(true)
            try {
                const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&q=${encodeURIComponent(q)}`
                const res = await fetch(url, {
                    signal: controller.signal,
                    headers: { 'Accept-Language': 'vi' },
                })
                if (!res.ok) throw new Error('Nominatim request failed')
                const data = await res.json()
                const mapped = (Array.isArray(data) ? data : []).map((item) => ({
                    displayName: item.display_name,
                    latitude: Number.parseFloat(item.lat),
                    longitude: Number.parseFloat(item.lon),
                    city: getCityFromNominatimAddress(item.address),
                }))
                setResults(mapped)
                setIsOpen(true)
            } catch (e) {
                if (e?.name !== 'AbortError') {
                    setResults([])
                    setIsOpen(false)
                }
            } finally {
                setIsLoading(false)
            }
        }, 350)

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
            if (abortRef.current) abortRef.current.abort()
        }
    }, [value])

    const pick = (item) => {
        onSelect?.(item)
        setIsOpen(false)
        setResults([])
    }

    return (
        <div className='relative'>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                onFocus={() => results.length && setIsOpen(true)}
                placeholder={placeholder}
                disabled={disabled}
                className='border border-gray-300 mt-2 rounded p-3 w-full'
                autoComplete="off"
            />

            {isLoading && (
                <p className='text-xs text-gray-500 mt-2'>Searching OpenStreetMap…</p>
            )}

            {isOpen && results.length > 0 && (
                <div className='absolute z-20 mt-2 w-full rounded border border-gray-200 bg-white shadow'>
                    <ul className='max-h-60 overflow-auto'>
                        {results.map((item, idx) => (
                            <li key={`${item.longitude}-${item.latitude}-${idx}`}>
                                <button
                                    type="button"
                                    onClick={() => pick(item)}
                                    className='w-full text-left px-3 py-2 hover:bg-gray-50'
                                >
                                    <p className='text-sm text-gray-800'>{item.displayName}</p>
                                    <p className='text-xs text-gray-500'>
                                        {Number.isFinite(item.latitude) && Number.isFinite(item.longitude)
                                            ? `Lat: ${item.latitude}, Lng: ${item.longitude}`
                                            : ''}
                                    </p>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default OSMAddressAutocomplete

