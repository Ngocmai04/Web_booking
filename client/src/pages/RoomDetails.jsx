import React, { useEffect, useState } from 'react'
import { assets, roomCommonData } from '../assets/assets'
import { useAppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

const RoomDetails = () => {
    const { id } = useParams();
    const { facilityIcons, rooms, getToken, axios, navigate } = useAppContext();

    const [room, setRoom] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [guests, setGuests] = useState(1);

    const [isAvailable, setIsAvailable] = useState(false);
    const [comments, setComments] = useState([]);

    // Check if the Room is Available
    const checkAvailability = async () => {
        try {

            //  Check is Check-In Date is greater than Check-Out Date
            if (checkInDate >= checkOutDate) {
                toast.error('Check-In Date should be less than Check-Out Date')
                return;
            }

            const { data } = await axios.post('/api/bookings/check-availability', { room: id, checkInDate, checkOutDate })
            if (data.success) {
                if (data.isAvailable) {
                    setIsAvailable(true)
                    toast.success('Room is available')
                } else {
                    setIsAvailable(false)
                    toast.error('Room is not available')
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // onSubmitHandler function to check availability & book the room
    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            if (!isAvailable) {
                return checkAvailability();
            } else {
                const { data } = await axios.post('/api/bookings/book', { room: id, checkInDate, checkOutDate, guests, paymentMethod: "Pay At Hotel" }, { headers: { Authorization: `Bearer ${await getToken()}` } })
                if (data.success) {
                    toast.success(data.message)
                    navigate('/my-bookings')
                    scrollTo(0, 0)
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        const room = rooms.find(room => room._id === id);
        room && setRoom(room);
        room && setMainImage(room.images[0]);
    }, [rooms]);

    // // Fetch ratings for this hotel by ID
    // useEffect(() => {
    //     if (!room) return;
    //     const fetchComments = async () => {
    //         try {
    //             console.log('Fetching ratings for hotel:', room.hotel._id, room.hotel.name);
                
    //             // Fetch by hotelID first (most reliable)
    //             let res = await axios.get(`/api/ratings?hotelID=${room.hotel._id}`);
    //             console.log('API Response:', res.data);
                
    //             let list = res.data.ratings || res.data.data || res.data || [];
    //             console.log('Parsed list:', list);
                
    //             // Fallback to hotel name if no results
    //             if (!list || list.length === 0) {
    //                 console.log('Trying fallback by hotel name:', room.hotel.name);
    //                 res = await axios.get(`/api/ratings?hotel_name=${encodeURIComponent(room.hotel.name)}`);
    //                 console.log('Fallback Response:', res.data);
    //                 list = res.data.ratings || res.data.data || res.data || [];
    //             }
                
    //             console.log('Final list:', list);
    //             setComments(list);
    //         } catch (error) {
    //             console.error('Error fetching ratings:', error.message);
    //             // Silent fail - just show no comments
    //             setComments([]);
    //         }
    //     }
    //     fetchComments();
    // }, [room]);
    useEffect(() => {
  if (!room?.hotel?._id) {
    console.log("room.hotel._id chưa có");
    return;
  }

  console.log("Fetching ratings for hotel ID:", room.hotel._id);

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `/api/ratings?hotel=${room.hotel._id}`
      );

      console.log("API result:", res.data);

      setComments(res.data.ratings || []);
    } catch (err) {
      console.error("Fetch rating error:", err);
      setComments([]);
    }
  };

  fetchComments();
}, [room]);




    const nights = checkInDate && checkOutDate ? Math.max(0, Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))) : 0;
    const estimatedTotal = nights ? (nights * room?.pricePerNight * guests) : 0;

    return room && (
        <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>

            {/* Room Details */}
            <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                <h1 className='text-3xl md:text-4xl font-playfair'>{room.hotel.name} <span className='font-inter text-sm'>({room.roomType})</span></h1>
                <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>20% OFF</p>
            </div>
            <div className='flex items-center gap-1 mt-2'>
                <StarRating />
                <p className='ml-2'>200+ reviews</p>
            </div>
            <div className='flex items-center gap-1 text-gray-500 mt-2'>
                <img src={assets.locationIcon} alt='location-icon' />
                <span>{room.hotel.address}</span>
            </div>

            {/* Room Images + Booking Form (form moved to the right of images on large screens) */}
            <div className='flex flex-col lg:flex-row mt-6 gap-6'>
                <div className='lg:w-2/3 w-full space-y-4'>
                    <div>
                        <img className='w-full rounded-xl shadow-lg object-cover'
                            src={mainImage} alt='Room Image' />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        {room?.images.length > 1 && room.images.map((image, index) => (
                            <img key={index} onClick={() => setMainImage(image)}
                                className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage === image && 'outline-3 outline-orange-500'}`} src={image} alt='Room Image' />
                        ))}
                    </div>
                </div>

                <div className='lg:w-1/3 w-full'>
                    <form onSubmit={onSubmitHandler} className='flex flex-col bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.12)] p-6 rounded-xl w-full lg:sticky lg:top-28'>
                        <div className='mb-4'>
                            <p className='text-sm text-gray-500'>Price</p>
                            <p className='text-2xl font-semibold text-black'>${room.pricePerNight} <span className='text-sm font-normal text-gray-500'>/ night</span></p>
                            {nights > 0 && (
                                <p className='text-sm text-gray-600 mt-1'>Estimated: <span className='font-medium'>${estimatedTotal}</span> · {nights} night{nights > 1 ? 's' : ''}</p>
                            )}
                        </div>
                        <div className='flex flex-col gap-4 text-gray-700'>
                            <div>
                                <label htmlFor='checkInDate' className='font-medium text-sm'>Check-In</label>
                                <input onChange={(e) => setCheckInDate(e.target.value)} id='checkInDate' type='date' min={new Date().toISOString().split('T')[0]} className='w-full rounded border border-gray-200 px-3 py-2 mt-1 outline-none shadow-sm' placeholder='Check-In' required />
                            </div>
                            <div>
                                <label htmlFor='checkOutDate' className='font-medium text-sm'>Check-Out</label>
                                <input onChange={(e) => setCheckOutDate(e.target.value)} id='checkOutDate' type='date' min={checkInDate} disabled={!checkInDate} className='w-full rounded border border-gray-200 px-3 py-2 mt-1 outline-none shadow-sm' placeholder='Check-Out' required />
                            </div>
                            <div>
                                <label htmlFor='guests' className='font-medium text-sm'>Guests</label>
                                <input onChange={(e) => setGuests(e.target.value)} value={guests} id='guests' type='number' min={1} className='w-full rounded border border-gray-200 px-3 py-2 mt-1 outline-none shadow-sm' placeholder='1' required />
                            </div>
                        </div>
                        <button type='submit' className='mt-4 bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md w-full py-3 text-base'>{isAvailable ? "Book Now" : "Check Availability"}</button>
                    </form>
                </div>
            </div>

            {/* Room Highlights */}
            <div className='flex flex-col md:flex-row md:justify-between mt-10'>
                <div className='flex flex-col'>
                    <h1 className='text-3xl md:text-4xl font-playfair'>Experience Luxury Like Never Before</h1>
                    <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                        {room.amenities.map((item, index) => (
                            <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
                                <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                <p className='text-xs'>{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Room Price */}
            </div>

            

            {/* Common Specifications */}
            <div className='mt-25 space-y-4'>                
                {roomCommonData.map((spec, index) => (
                    <div key={index} className='flex items-start gap-2'>
                        <img className='w-6.5' src={spec.icon} alt={`${spec.title}-icon`} />
                        <div>
                            <p className='text-base'>{spec.title}</p>
                            <p className='text-gray-500'>{spec.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
                <p>Guests will be allocated on the ground floor according to availability. You get a comfortable Two bedroom apartment has a true city feeling. The price quoted is for two guest, at the guest slot please mark the number of guests to get the exact price for groups. The Guests will be allocated ground floor according to availability. You get the comfortable two bedroom apartment that has a true city feeling.</p>
            </div>
            {/* Comments */}
            <div className="mt-8">
  <h5 className="text-lg font-semibold">
    Guests who stayed here loved
  </h5>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    {comments.length > 0 ? (
      comments.map((c) => (
        <div
          key={c._id}
          className="p-4 bg-white rounded-lg shadow-sm border"
        >
          <div className="flex items-start gap-3 mb-2">
            {/* <img
              src={assets.userIcon}
              alt="Guest"
              className="h-10 w-10 rounded-full object-cover"
            /> */}

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-black">
                  {"Guest"}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                Đánh giá lúc {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* ⭐ Overall rating */}
              {c.ratings?.overall && (
                <div className='flex items-center gap-1 mt-1'>
                    {[...Array(5)].map((_, i) => (
                    <span
                        key={i}
                        className={i < c.ratings.overall ? 'text-yellow-400' : 'text-gray-300'}
                    >
                        ★
                    </span>
                    ))}
                </div>
                )}

            </div>
          </div>

          {/* 💬 Comment text */}
          {c.comment && (
            <p className="text-gray-700 text-sm">
              {c.comment}
            </p>
          )}
        </div>
      ))
    ) : (
      <p className="text-gray-500">No reviews yet.</p>
    )}
  </div>
</div>

        </div>
    )
}

export default RoomDetails
