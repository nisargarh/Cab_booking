import { BookingType, Location, Ride, TripType, Vehicle } from '@/types';
import { create } from 'zustand';

type RideState = {
  currentRide: Partial<Ride> | null;
  pastRides: Ride[];
  setBookingType: (type: BookingType) => void;
  setTripType: (type: TripType) => void;
  setPickup: (location: Location) => void;
  setDropoff: (location: Location) => void;
  setDateTime: (date: string, time: string) => void;
  setPassengers: (count: number) => void;

  setVehicle: (vehicle: Vehicle) => void;
  setPaymentMethod: (method: 'cash' | 'online' | 'card') => void;
  completeRide: (rating?: number, review?: string) => void;
  resetRide: () => void;
};

export const useRideStore = create<RideState>((set) => ({
  currentRide: null,
  pastRides: [],
  
  setBookingType: (bookingType) => 
    set((state) => ({ 
      currentRide: { ...state.currentRide, bookingType } 
    })),
  
  setTripType: (tripType) => 
    set((state) => ({ 
      currentRide: { ...state.currentRide, tripType } 
    })),
  
  setPickup: (pickup) => 
    set((state) => ({ 
      currentRide: { ...state.currentRide, pickup } 
    })),
  
  setDropoff: (dropoff) => 
    set((state) => ({ 
      currentRide: { ...state.currentRide, dropoff } 
    })),
  
  setDateTime: (date, time) => 
    set((state) => ({ 
      currentRide: { ...state.currentRide, date, time } 
    })),
  
  setPassengers: (passengers) => 
    set((state) => ({ 
      currentRide: { ...state.currentRide, passengers } 
    })),
  

  
  setVehicle: (vehicle) => 
    set((state) => {
      const distance = 15; // Mock distance in km
      const duration = 25; // Mock duration in minutes
      const baseFare = vehicle.price;
      const distanceFare = distance * 2;
      const timeFare = duration * 0.5;
      const surge = 0; // No surge for now
      const subtotal = baseFare + distanceFare + timeFare + surge;
      const tax = subtotal * 0.1;
      const total = subtotal + tax;
      
      return { 
        currentRide: { 
          ...state.currentRide, 
          vehicle,
          distance,
          duration,
          fare: {
            base: baseFare,
            distance: distanceFare,
            time: timeFare,
            surge,
            tax,
            total,
            advancePayment: total * 0.25,
            remainingPayment: total * 0.75,
          }
        } 
      };
    }),
  
  setPaymentMethod: (paymentMethod) => 
    set((state) => ({ 
      currentRide: { ...state.currentRide, paymentMethod } 
    })),
  
  completeRide: (rating, review) => 
    set((state) => {
      if (!state.currentRide) return state;
      
      const completedRide = {
        ...state.currentRide,
        id: Date.now().toString(),
        riderId: 'user1',
        status: 'completed' as const,
        paymentStatus: 'completed' as const,
        passengerInfo: [], // Empty array since we removed passenger info collection
        rating,
        review,
      } as Ride;
      
      return {
        pastRides: [...state.pastRides, completedRide],
        currentRide: null,
      };
    }),
  
  resetRide: () => set({ currentRide: null }),
}));

export const useRides = () => {
  return useRideStore();
};