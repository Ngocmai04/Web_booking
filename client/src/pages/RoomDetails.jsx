import React, { useEffect, useState, useCallback } from 'react'
import { roomCommonData } from '../assets/assets'
import { useAppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

const RoomDetails = () => {
    const { id } = useParams();
    const { facilityIcons, rooms, getToken, axios, navigate, user, isOwner } = useAppContext(); // ✅ Thêm user, isOwner từ context

    const [room, setRoom] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [guests, setGuests] = useState(1);
    const [isAvailable, setIsAvailable] = useState(false);
    const [showAllImages, setShowAllImages] = useState(false);
    const [showReviewsSidebar, setShowReviewsSidebar] = useState(false);

    // Review form states
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewData, setReviewData] = useState({
        rating: 5,
        staffRating: 5,
        serviceRating: 5,
        cleanlinessRating: 5,
        comment: ''
    });

    // Reviews from database
    const [reviews, setReviews] = useState([]);
    const [avgRatings, setAvgRatings] = useState({
        overall: 0,
        staff: 0,
        service: 0,
        cleanliness: 0
    });
    const [loading, setLoading] = useState(false);

    // Fetch reviews from database
    const fetchReviews = useCallback(async () => {
        try {
            if (!room?.hotel?._id) return;
            
            setLoading(true);
            const { data } = await axios.get(`/api/ratings?hotel=${room.hotel._id}`);
            
            if (data.success) {
                setReviews(data.ratings);
                
                // Calculate average ratings
                if (data.ratings.length > 0) {
                    const totals = data.ratings.reduce((acc, review) => ({
                        overall: acc.overall + review.ratings.overall,
                        staff: acc.staff + (review.ratings.staff || 0),
                        service: acc.service + (review.ratings.service || 0),
                        cleanliness: acc.cleanliness + (review.ratings.cleanliness || 0)
                    }), { overall: 0, staff: 0, service: 0, cleanliness: 0 });

                    setAvgRatings({
                        overall: (totals.overall / data.ratings.length).toFixed(1),
                        staff: (totals.staff / data.ratings.length).toFixed(1),
                        service: (totals.service / data.ratings.length).toFixed(1),
                        cleanliness: (totals.cleanliness / data.ratings.length).toFixed(1)
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    }, [room?.hotel?._id, axios]);

    const checkAvailability = async () => {
        try {
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
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        try {
            const token = await getToken();
            if (!token) {
                toast.error('Please login to submit a review');
                return;
            }

            const payload = {
                hotel: room.hotel._id,
                ratings: {
                    overall: reviewData.rating,
                    staff: reviewData.staffRating,
                    service: reviewData.serviceRating,
                    cleanliness: reviewData.cleanlinessRating
                },
                comment: reviewData.comment
            };

            // Check if user already has a review
            const existingReview = reviews.find(r => r.user?._id === user?.id);
            
            if (existingReview) {
                // Update existing review
                const { data } = await axios.put(`/api/ratings/${existingReview._id}`, payload, { 
                    headers: { Authorization: `Bearer ${token}` } 
                });

                if (data.success) {
                    toast.success('🎄 Review updated successfully!');
                    setShowReviewForm(false);
                    setReviewData({
                        rating: 5,
                        staffRating: 5,
                        serviceRating: 5,
                        cleanlinessRating: 5,
                        comment: ''
                    });
                    fetchReviews();
                } else {
                    toast.error(data.message);
                }
            } else {
                // Create new review
                const { data } = await axios.post('/api/ratings', payload, { 
                    headers: { Authorization: `Bearer ${token}` } 
                });

                if (data.success) {
                    toast.success('🎄 Review submitted successfully!');
                    setShowReviewForm(false);
                    setReviewData({
                        rating: 5,
                        staffRating: 5,
                        serviceRating: 5,
                        cleanlinessRating: 5,
                        comment: ''
                    });
                    fetchReviews();
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.error('Error:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to submit review');
        }
    };

    // Handle delete review
    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        
        try {
            const token = await getToken();
            const { data } = await axios.delete(`/api/ratings/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success('Review deleted successfully!');
                fetchReviews();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete review');
        }
    };

    // Handle edit review
    const handleEditReview = (review) => {
        setReviewData({
            rating: review.ratings.overall,
            staffRating: review.ratings.staff || review.ratings.overall,
            serviceRating: review.ratings.service || review.ratings.overall,
            cleanlinessRating: review.ratings.cleanliness || review.ratings.overall,
            comment: review.comment
        });
        setShowReviewForm(true);
    };

    useEffect(() => {
        const room = rooms.find(room => room._id === id);
        room && setRoom(room);
        room && setMainImage(room.images[0]);
    }, [rooms, id]);

    useEffect(() => {
        if (room?.hotel?._id) {
            fetchReviews();
        }
    }, [room?.hotel?._id, fetchReviews]);

    const displayedReviews = reviews.slice(0, 3);
    const remainingImages = room?.images.length > 5 ? room.images.length - 5 : 0;

    const StarRatingInput = ({ value, onChange, label, color = "yellow" }) => (
        <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">{label}</label>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        className={`text-3xl transition-all hover:scale-110 ${star <= value ? `text-${color}-500` : 'text-gray-300'}`}
                    >
                        ★
                    </button>
                ))}
            </div>
        </div>
    );

    if (!room) return null;

    return (
        <>
            {/* Reviews Sidebar */}
            {showReviewsSidebar && (
                <div className="fixed inset-0 bg-black/60 z-[9999] flex justify-end" onClick={() => setShowReviewsSidebar(false)}>
                    <div 
                        className="w-full md:w-[600px] h-full bg-gradient-to-br from-red-50 via-white to-green-50 shadow-2xl overflow-y-auto animate-slideIn"
                        onClick={(e) => e.stopPropagation()}
                        style={{ animation: 'slideIn 0.3s ease-out' }}
                    >
                        {/* Sidebar Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-red-600 via-green-600 to-red-600 p-6 border-b-4 border-yellow-400 z-10">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    ⭐ All Reviews ({reviews.length})
                                </h2>
                                <button 
                                    onClick={() => setShowReviewsSidebar(false)}
                                    className="text-white text-3xl hover:scale-110 transition-transform bg-white/20 rounded-full w-10 h-10 flex items-center justify-center"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Reviews List */}
                        <div className="p-6 space-y-4">
                            {loading ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Loading reviews...</p>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                                </div>
                            ) : (
                                reviews.map((review) => {
                                    const isMyReview = review.user?._id === user?.id;
                                    return (
                                        <div key={review._id} className='bg-white p-6 rounded-2xl border-3 border-red-200 shadow-lg hover:shadow-2xl transition-all'>
                                            <div className='flex items-center gap-3 mb-4'>
                                                <img 
                                                    src={review.user?.image || user?.imageUrl || "https://i.pravatar.cc/150?img=10"} 
                                                    alt={review.user?.username || "User"} 
                                                    className='w-14 h-14 rounded-full border-3 border-green-400 shadow-md' 
                                                />
                                                <div className='flex-1'>
                                                    <div className="flex items-center gap-2">
                                                        <p className='font-bold text-gray-800 text-lg'>
                                                            {isMyReview ? 'You' : (review.user?.username || "Anonymous")}
                                                        </p>
                                                        {isMyReview && (
                                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Your Review</span>
                                                        )}
                                                    </div>
                                                    <p className='text-sm text-gray-500'>
                                                        {new Date(review.createdAt).toLocaleDateString('en-US', { 
                                                            month: 'short', 
                                                            day: 'numeric', 
                                                            year: 'numeric' 
                                                        })}
                                                    </p>
                                                </div>
                                                {isMyReview && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEditReview(review)}
                                                            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all"
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteReview(review._id)}
                                                            className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-all"
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className='flex items-center gap-1 mb-4'>
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={`text-2xl ${i < review.ratings.overall ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                                                ))}
                                            </div>

                                            <p className='text-gray-700 leading-relaxed mb-4'>{review.comment}</p>

                                            <div className='grid grid-cols-3 gap-2'>
                                                <div className='px-3 py-2 bg-red-100 text-red-700 rounded-xl font-semibold text-center'>
                                                    <p className="text-xs">Staff</p>
                                                    <p className="text-lg">{review.ratings.staff || 0} ⭐</p>
                                                </div>
                                                <div className='px-3 py-2 bg-green-100 text-green-700 rounded-xl font-semibold text-center'>
                                                    <p className="text-xs">Service</p>
                                                    <p className="text-lg">{review.ratings.service || 0} ⭐</p>
                                                </div>
                                                <div className='px-3 py-2 bg-blue-100 text-blue-700 rounded-xl font-semibold text-center'>
                                                    <p className="text-xs">Clean</p>
                                                    <p className="text-lg">{review.ratings.cleanliness || 0} ⭐</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Write Review Section in Sidebar */}
                        {/* Ẩn nút Write Review trong sidebar cho owner */}
                        {!isOwner && (
                            <div className="sticky bottom-0 bg-gradient-to-br from-yellow-100 to-green-100 p-6 border-t-4 border-red-300">
                                <button 
                                    onClick={() => {
                                        setShowReviewsSidebar(false);
                                        setShowReviewForm(true);
                                    }}
                                    className="w-full bg-gradient-to-r from-red-600 to-green-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-3 border-yellow-400"
                                >
                                    ✍️ Write Your Review
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Write Review Modal */}
            {showReviewForm && (
                <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4" onClick={() => setShowReviewForm(false)}>
                    <div 
                        className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-red-50 to-green-50 rounded-3xl p-8 border-4 border-yellow-400 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent flex items-center gap-2">
                                ✍️ Write Your Review
                            </h2>
                            <button 
                                onClick={() => setShowReviewForm(false)}
                                className="text-gray-500 text-3xl hover:scale-110 transition-transform hover:text-red-600"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmitReview} className="space-y-6">
                            {/* Overall Rating */}
                            <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-6 rounded-2xl border-3 border-yellow-400">
                                <StarRatingInput 
                                    value={reviewData.rating}
                                    onChange={(val) => setReviewData({...reviewData, rating: val})}
                                    label="⭐ Overall Rating"
                                    color="yellow"
                                />
                            </div>

                            {/* Staff Rating */}
                            <div className="bg-gradient-to-r from-red-100 to-red-200 p-6 rounded-2xl border-3 border-red-400">
                                <StarRatingInput 
                                    value={reviewData.staffRating}
                                    onChange={(val) => setReviewData({...reviewData, staffRating: val})}
                                    label="👥 Staff Rating"
                                    color="red"
                                />
                            </div>

                            {/* Service Rating */}
                            <div className="bg-gradient-to-r from-green-100 to-green-200 p-6 rounded-2xl border-3 border-green-400">
                                <StarRatingInput 
                                    value={reviewData.serviceRating}
                                    onChange={(val) => setReviewData({...reviewData, serviceRating: val})}
                                    label="🔔 Service Rating"
                                    color="green"
                                />
                            </div>

                            {/* Cleanliness Rating */}
                            <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-2xl border-3 border-blue-400">
                                <StarRatingInput 
                                    value={reviewData.cleanlinessRating}
                                    onChange={(val) => setReviewData({...reviewData, cleanlinessRating: val})}
                                    label="✨ Cleanliness Rating"
                                    color="blue"
                                />
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="font-bold text-gray-700 mb-2 block text-lg">💬 Your Review</label>
                                <textarea
                                    value={reviewData.comment}
                                    onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                                    placeholder="Share your experience with us..."
                                    rows="5"
                                    className="w-full rounded-2xl border-3 border-green-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-200 transition-all shadow-md resize-none"
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={!reviewData.comment.trim()}
                                className="w-full bg-gradient-to-r from-red-600 via-green-600 to-red-600 hover:from-red-700 hover:via-green-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-2xl px-8 py-4 text-xl shadow-2xl hover:shadow-red-500/50 border-4 border-yellow-400 transition-all hover:scale-105 active:scale-95"
                            >
                                🎄 Submit Review
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Image Gallery Modal */}
            {showAllImages && (
                <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4" onClick={() => setShowAllImages(false)}>
                    <div className="max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-red-900 to-green-900 rounded-3xl p-6 border-4 border-yellow-400" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                🎄 All Photos ({room.images.length})
                            </h3>
                            <button onClick={() => setShowAllImages(false)} className="text-white text-3xl hover:scale-110 transition-transform">✕</button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {room.images.map((image, index) => (
                                <img key={index} src={image} alt={`Room ${index + 1}`} className="w-full h-64 object-cover rounded-xl border-4 border-yellow-400/60 hover:border-green-400 transition-all cursor-pointer hover:scale-105" />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className='relative py-24 md:py-32 px-4 md:px-12 lg:px-20 xl:px-28 bg-gradient-to-b from-emerald-900 via-red-950 to-emerald-950 overflow-hidden min-h-screen'>
                {/* Magical Christmas Background */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={`snow-${i}`}
                            className="absolute text-white animate-snow-fall"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDuration: `${10 + Math.random() * 15}s`,
                                animationDelay: `${Math.random() * 8}s`,
                                fontSize: `${8 + Math.random() * 12}px`,
                                opacity: 0.6 + Math.random() * 0.4,
                            }}
                        >
                            ❄
                        </div>
                    ))}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-green-500 via-yellow-400 via-red-500 to-green-500 opacity-70 animate-pulse"></div>
                </div>

                <style>{`
                    @keyframes snow-fall {
                        0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
                        10% { opacity: 1; }
                        90% { opacity: 1; }
                        100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
                    }
                    @keyframes shimmer {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.6; }
                    }
                    @keyframes slideIn {
                        from { transform: translateX(100%); }
                        to { transform: translateX(0); }
                    }
                `}</style>

                <div className='relative z-10 max-w-7xl mx-auto'>
                    {/* Header with Hotel Name & Price */}
                    <div className="bg-gradient-to-br from-red-600/90 via-green-600/90 to-red-600/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border-4 border-yellow-400/50 mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-4xl animate-shimmer">🎄</span>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                                        {room.hotel.name}
                                    </h1>
                                </div>
                                <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold text-sm border-2 border-white/40 mb-3">
                                    ✨ {room.roomType}
                                </span>
                                <div className='flex items-center gap-2 text-white/90'>
                                    <span className="text-lg">📍</span>
                                    <span className="text-sm">{room.hotel.address}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {room.discount > 0 && (
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50 animate-pulse"></div>
                                        <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-500 px-6 py-4 rounded-2xl shadow-2xl border-4 border-red-600">
                                            <p className="text-red-700 font-black text-3xl text-center">🎅 {room.discount}%</p>
                                            <p className="text-red-800 font-bold text-sm text-center">OFF</p>
                                        </div>
                                    </div>
                                )}
                                
                                <div className='relative'>
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-green-500 blur-xl opacity-50"></div>
                                    <div className='relative bg-gradient-to-br from-red-600 to-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl border-4 border-yellow-400'>
                                        <p className='text-sm font-semibold opacity-90 text-center'>🎁 From</p>
                                        <p className='text-4xl font-black text-center'>${room.pricePerNight}</p>
                                        <p className='text-xs opacity-90 text-center'>/night</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Left Column - Images */}
                        <div className="lg:col-span-2">
                            <div className='bg-white/95 backdrop-blur-sm p-4 rounded-3xl shadow-2xl border-4 border-green-300'>
                                {/* Main Image */}
                                <div className='relative group mb-4'>
                                    <div className="absolute inset-0 bg-gradient-to-t from-red-600/30 to-transparent rounded-2xl z-10 pointer-events-none"></div>
                                    <img 
                                        className='w-full h-[400px] rounded-2xl object-cover border-4 border-yellow-400/60 transform group-hover:scale-[1.02] transition-transform duration-300'
                                        src={mainImage} 
                                        alt='Room Image' 
                                    />
                                    <div className="absolute top-4 right-4 z-20 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                                        ✨ Featured
                                    </div>
                                </div>

                                {/* Thumbnail Grid */}
                                <div className='grid grid-cols-5 gap-2'>
                                    {room.images.slice(0, 5).map((image, index) => (
                                        <div 
                                            key={index} 
                                            className={`relative group cursor-pointer ${index === 4 && remainingImages > 0 ? 'overflow-hidden' : ''}`}
                                            onClick={() => index === 4 && remainingImages > 0 ? setShowAllImages(true) : setMainImage(image)}
                                        >
                                            <img
                                                className={`w-full h-20 rounded-lg object-cover border-3 transition-all duration-300 group-hover:scale-105 ${mainImage === image ? 'border-yellow-400 shadow-yellow-400/50 shadow-lg' : 'border-green-300 hover:border-red-300'}`}
                                                src={image} 
                                                alt='Room Image' 
                                            />
                                            {index === 4 && remainingImages > 0 && (
                                                <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg">+{remainingImages}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Booking Form */}
                        <div className="lg:col-span-1">
                            <div className='bg-gradient-to-br from-white via-green-50 to-red-50 backdrop-blur-sm shadow-2xl p-6 rounded-3xl border-4 border-green-300 sticky top-24'>
                                <h3 className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
                                    <span className="text-2xl">🎄</span>
                                    Book Your Stay
                                </h3>

                                <div className='space-y-4'>
                                    <div>
                                        <label className='font-bold text-red-700 flex items-center gap-2 mb-2'>
                                            🎄 Check-In
                                        </label>
                                        <input
                                            onChange={(e) => setCheckInDate(e.target.value)}
                                            type='date'
                                            min={new Date().toISOString().split('T')[0]}
                                            className='w-full rounded-xl border-3 border-red-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-200 transition-all shadow-md bg-white'
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className='font-bold text-green-700 flex items-center gap-2 mb-2'>
                                            🎁 Check-Out
                                        </label>
                                        <input
                                            onChange={(e) => setCheckOutDate(e.target.value)}
                                            type='date'
                                            min={checkInDate}
                                            disabled={!checkInDate}
                                            className='w-full rounded-xl border-3 border-green-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all shadow-md bg-white disabled:opacity-50'
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className='font-bold text-red-700 flex items-center gap-2 mb-2'>
                                            👥 Guests
                                        </label>
                                        <input
                                            onChange={(e) => setGuests(e.target.value)}
                                            value={guests}
                                            type='number'
                                            min="1"
                                            className='w-full rounded-xl border-3 border-red-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-200 transition-all shadow-md bg-white'
                                            required
                                        />
                                    </div>

                                    <button
                                        onClick={onSubmitHandler}
                                        type='button'
                                        className='w-full bg-gradient-to-r from-red-600 via-green-600 to-red-600 hover:from-red-700 hover:via-green-700 hover:to-red-700 active:scale-95 transition-all text-white font-black rounded-2xl px-6 py-4 text-lg cursor-pointer shadow-2xl hover:shadow-red-500/50 border-4 border-yellow-400 relative overflow-hidden group'>
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {isAvailable ? "🎅 Book Now" : "🎄 Check Availability"}
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Amenities & Features */}
                    <div className='bg-gradient-to-br from-white via-red-50 to-green-50 p-6 rounded-3xl shadow-2xl border-4 border-red-200 mb-6'>
                        <h2 className='text-2xl font-bold bg-gradient-to-r from-red-700 to-green-700 bg-clip-text text-transparent mb-4 flex items-center gap-2'>
                            ✨ Amenities & Features
                        </h2>
                        
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-6'>
                            {room.amenities.map((item, index) => (
                                <div key={index} className='flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-100 to-green-100 shadow-md border-2 border-red-200 hover:shadow-xl hover:scale-105 transition-all cursor-pointer'>
                                    <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                    <p className='text-sm font-semibold text-gray-700'>{item}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3">
                            {roomCommonData.slice(0, 3).map((spec, index) => (
                                <div key={index} className='flex items-start gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-green-50 transition-all border-2 border-transparent hover:border-red-200 cursor-pointer'>
                                    <img className='w-6 h-6' src={spec.icon} alt={spec.title} />
                                    <div>
                                        <p className='font-bold text-gray-800'>{spec.title}</p>
                                        <p className='text-gray-600 text-sm'>{spec.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className='bg-gradient-to-br from-white via-green-50 to-red-50 p-6 rounded-3xl shadow-2xl border-4 border-green-300 mb-6'>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className='text-2xl font-bold bg-gradient-to-r from-red-700 to-green-700 bg-clip-text text-transparent flex items-center gap-2'>
                                ⭐ Guest Reviews
                            </h2>
                            <div className="flex gap-3">
                                {/* Ẩn nút Write Review cho owner */}
                                {!isOwner && (
                                    <button 
                                        onClick={() => setShowReviewForm(true)}
                                        className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-700 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg border-2 border-red-500"
                                    >
                                        ✍️ Write Review
                                    </button>
                                )}
                                <button 
                                    onClick={() => setShowReviewsSidebar(true)}
                                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-green-500 text-white rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg"
                                >
                                    View All ({reviews.length})
                                </button>
                            </div>
                        </div>

                        {/* Overall Ratings */}
                        {reviews.length > 0 && (
                            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
                                <div className='bg-gradient-to-br from-yellow-100 to-yellow-200 p-4 rounded-2xl border-3 border-yellow-400 shadow-lg text-center'>
                                    <p className='text-3xl font-black text-yellow-700'>{avgRatings.overall}</p>
                                    <p className='text-sm font-bold text-yellow-800 mt-1'>Overall</p>
                                    <div className='flex justify-center mt-2'>
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`text-lg ${i < Math.round(avgRatings.overall) ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                                        ))}
                                    </div>
                                </div>

                                <div className='bg-gradient-to-br from-red-100 to-red-200 p-4 rounded-2xl border-3 border-red-400 shadow-lg text-center'>
                                    <p className='text-3xl font-black text-red-700'>{avgRatings.staff}</p>
                                    <p className='text-sm font-bold text-red-800 mt-1'>Staff</p>
                                    <div className='flex justify-center mt-2'>
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`text-lg ${i < Math.round(avgRatings.staff) ? 'text-red-500' : 'text-gray-300'}`}>★</span>
                                        ))}
                                    </div>
                                </div>

                                <div className='bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-2xl border-3 border-green-400 shadow-lg text-center'>
                                    <p className='text-3xl font-black text-green-700'>{avgRatings.service}</p>
                                    <p className='text-sm font-bold text-green-800 mt-1'>Service</p>
                                    <div className='flex justify-center mt-2'>
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`text-lg ${i < Math.round(avgRatings.service) ? 'text-green-500' : 'text-gray-300'}`}>★</span>
                                        ))}
                                    </div>
                                </div>

                                <div className='bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-2xl border-3 border-blue-400 shadow-lg text-center'>
                                    <p className='text-3xl font-black text-blue-700'>{avgRatings.cleanliness}</p>
                                    <p className='text-sm font-bold text-blue-800 mt-1'>Cleanliness</p>
                                    <div className='flex justify-center mt-2'>
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`text-lg ${i < Math.round(avgRatings.cleanliness) ? 'text-blue-500' : 'text-gray-300'}`}>★</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Review Cards Preview */}
                        {loading ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Loading reviews...</p>
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">No reviews yet. Be the first to review!</p>
                                {/* Ẩn nút Write First Review cho owner */}
                                {!isOwner && (
                                    <button 
                                        onClick={() => setShowReviewForm(true)}
                                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-green-500 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg"
                                    >
                                        ✍️ Write First Review
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                {displayedReviews.map((review) => {
                                    const isMyReview = review.user?._id === user?.id;
                                    return (
                                        <div key={review._id} className='bg-white p-5 rounded-2xl border-3 border-red-200 shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer relative'>
                                            {isMyReview && (
                                                <div className="absolute top-2 right-2 flex gap-1">
                                                    <button
                                                        onClick={() => handleEditReview(review)}
                                                        className="p-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600"
                                                        title="Edit"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteReview(review._id)}
                                                        className="p-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600"
                                                        title="Delete"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            )}
                                            <div className='flex items-center gap-3 mb-3'>
                                                <img 
                                                    src={review.user?.image || user?.imageUrl || "https://i.pravatar.cc/150?img=10"} 
                                                    alt={review.user?.username || "User"} 
                                                    className='w-12 h-12 rounded-full border-3 border-green-400 shadow-md' 
                                                />
                                                <div className='flex-1'>
                                                    <div className="flex items-center gap-1">
                                                        <p className='font-bold text-gray-800'>
                                                            {isMyReview ? 'You' : (review.user?.username || "Anonymous")}
                                                        </p>
                                                        {isMyReview && <span className="text-xs text-green-600">✓</span>}
                                                    </div>
                                                    <p className='text-xs text-gray-500'>
                                                        {new Date(review.createdAt).toLocaleDateString('en-US', { 
                                                            month: 'short', 
                                                            day: 'numeric', 
                                                            year: 'numeric' 
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className='flex items-center gap-1 mb-3'>
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={`text-lg ${i < review.ratings.overall ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                                                ))}
                                            </div>

                                            <p className='text-gray-700 text-sm leading-relaxed mb-3'>{review.comment}</p>

                                            <div className='flex items-center gap-2 text-xs flex-wrap'>
                                                <span className='px-2 py-1 bg-red-100 text-red-700 rounded-full font-semibold'>Staff: {review.ratings.staff || 0}⭐</span>
                                                <span className='px-2 py-1 bg-green-100 text-green-700 rounded-full font-semibold'>Service: {review.ratings.service || 0}⭐</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className='bg-gradient-to-br from-red-50 via-white to-green-50 border-4 border-red-200 p-6 rounded-3xl shadow-xl mb-6'>
                        <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                            🏠 About This Property
                        </h3>
                        <p className='text-gray-700 leading-relaxed'>
                            Guests will be allocated on the ground floor according to availability. You get a comfortable two bedroom apartment that has a true city feeling. The price quoted is for two guests; at the guest slot, please mark the number of guests to get the exact price for groups. Experience comfort and luxury in this beautifully appointed space.
                        </p>
                    </div>

                    {/* Host Information */}
                    <div className='bg-gradient-to-br from-white to-green-50 p-6 rounded-3xl shadow-2xl border-4 border-green-300'>
                        <div className='flex flex-col md:flex-row md:items-center gap-6'>
                            <div className='relative'>
                                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-green-500 rounded-full blur-xl opacity-50"></div>
                                <img
                                    className='relative h-20 w-20 md:h-24 md:w-24 rounded-full border-4 border-yellow-400 shadow-2xl object-cover'
                                    src={room.hotel.owner.image}
                                    alt='Host'
                                />
                            </div>
                            <div className='flex-1'>
                                <p className='text-2xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-2'>
                                    Hosted by {room.hotel.name}
                                </p>
                                <div className='flex items-center gap-3 mb-3'>
                                    <StarRating />
                                    <p className='text-gray-700 font-medium'>{reviews.length}+ reviews</p>
                                </div>
                                <button className='px-6 py-2 rounded-xl text-white bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl font-bold border-2 border-yellow-400 hover:scale-105'>
                                    📞 Contact Host
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RoomDetails;