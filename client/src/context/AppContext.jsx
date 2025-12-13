import { useAuth, useUser } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY || "$";
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken } = useAuth()

    const [isOwner, setIsOwner] = useState(false);
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [ownerHotels, setOwnerHotels] = useState([]);
    const [searchedCities, setSearchedCities] = useState([]); // max 3 recent searched cities

    const facilityIcons = {
        "Free WiFi": assets.freeWifiIcon,
        "Free Breakfast": assets.freeBreakfastIcon,
        "Room Service": assets.roomServiceIcon,
        "Mountain View": assets.mountainIcon,
        "Pool Access": assets.poolIcon,
    };

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user', { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                setIsOwner(data.role === "hotelOwner");
                setSearchedCities(data.recentSearchedCities)
            } else {
                // Retry Fetching User Details after 5 seconds
                // Useful when user creates account using email & password
                setTimeout(() => {
                    fetchUser();
                }, 2000);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchRooms = async () => {
        try {
            const { data } = await axios.get('/api/rooms')
            if (data.success) {
                setRooms(data.rooms)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchHotels = async () => {
        try {
            const { data } = await axios.get('/api/hotels');
            if (data.success) {
                setHotels(data.hotels);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchOwnerHotels = async () => {
        try {
            const { data } = await axios.get('/api/hotels/owner', { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                setOwnerHotels(data.hotels);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (user) {
            fetchUser();
        }
    }, [user]);

    useEffect(() => {
        fetchRooms();
        fetchHotels();
    }, []);

    useEffect(() => {
        if (user && isOwner) {
            fetchOwnerHotels();
        }
    }, [user, isOwner]);

    const value = {
        currency, navigate,
        user, getToken,
        isOwner, setIsOwner,
        axios,
        showHotelReg, setShowHotelReg,
        facilityIcons,
        rooms, setRooms,
        hotels, setHotels,
        ownerHotels, setOwnerHotels,
        fetchHotels, fetchOwnerHotels,
        searchedCities, setSearchedCities
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );

};

export const useAppContext = () => useContext(AppContext);