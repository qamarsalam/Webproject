import { createContext, useState } from "react";

export const RegistrationContext = createContext({
    registrations: {}, // { eventId: [userId1, userId2, ...] }
    registerUser: () => { },
    unregisterUser: () => { },
    isUserRegistered: () => false,
    getAvailableSeats: () => 0,
});

export function RegistrationProvider({ children }) {
    const [registrations, setRegistrations] = useState({});

    const registerUser = (eventId, userId, totalSeats) => {
        setRegistrations((prev) => {
            const eventRegs = prev[eventId] || [];

            // Check if user is already registered
            if (eventRegs.includes(userId)) {
                return prev;
            }

            // Check if seats are available
            if (eventRegs.length >= totalSeats) {
                return prev;
            }

            return {
                ...prev,
                [eventId]: [...eventRegs, userId],
            };
        });
    };

    const unregisterUser = (eventId, userId) => {
        setRegistrations((prev) => {
            const eventRegs = prev[eventId] || [];
            const updatedRegs = eventRegs.filter((registeredUserId) => registeredUserId !== userId);

            if (updatedRegs.length === eventRegs.length) {
                return prev;
            }

            return {
                ...prev,
                [eventId]: updatedRegs,
            };
        });
    };

    const isUserRegistered = (eventId, userId) => {
        return (registrations[eventId] || []).includes(userId);
    };

    const getAvailableSeats = (eventId, totalSeats) => {
        const registered = (registrations[eventId] || []).length;
        return Math.max(0, totalSeats - registered);
    };

    return (
        <RegistrationContext.Provider value={{ registrations, registerUser, unregisterUser, isUserRegistered, getAvailableSeats }}>
            {children}
        </RegistrationContext.Provider>
    );
}
