export type UserRole = 'rider' | 'driver' | null;

export type User = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  profileImage?: string;
  addresses?: SavedAddress[];
};

export type SavedAddress = {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type BookingType = 'airport' | 'outstation' | 'hourly' | 'city' | 'shared';
export type TripType = 'one-way' | 'round-trip' | 'shared';

export type Location = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type Vehicle = {
  id: string;
  name: string;
  type: string;
  image: string;
  capacity: number;
  price: number;
  rating: number;
  seatingCapacity: number;
  features: string[];
};

export type Driver = {
  id: string;
  name: string;
  phone: string;
  rating: number;
  profileImage?: string;
  vehicleDetails: {
    model: string;
    color: string;
    plateNumber: string;
  };
};

export type RideStatus = 
  | 'pending' 
  | 'accepted' 
  | 'arriving' 
  | 'arrived' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export type PassengerInfo = {
  name: string;
  age: number;
  phone: string;
};

export type Ride = {
  id: string;
  riderId: string;
  driverId?: string;
  bookingType: BookingType;
  tripType: TripType;
  pickup: Location;
  dropoff: Location;
  date: string;
  time: string;
  passengers: number;
  passengerInfo: PassengerInfo[];
  vehicle?: Vehicle;
  status: RideStatus;
  fare: {
    base: number;
    distance: number;
    time: number;
    surge: number;
    tax: number;
    total: number;
    advancePayment: number;
    remainingPayment: number;
  };
  paymentMethod?: 'card' | 'upi';
  paymentStatus: 'pending' | 'partial' | 'completed';
  distance: number;
  duration: number;
  rating?: number;
  review?: string;
};

export type Theme = 'light' | 'dark';