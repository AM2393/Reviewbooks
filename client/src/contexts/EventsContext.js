import { useEffect, useState, createContext, useContext } from 'react';
import { SERVER_API } from '../constants/constants';

import { useAuth } from '../contexts/AuthContext';

const EventsContext = createContext();
export const useEventsContext = () => {
    return useContext(EventsContext);
};

export const EventsProvider = ({ children }) => {
    const [eventsObject, setEventData] = useState({
        state: 'ready',
        error: null,
        data: null,
    });

    const { state: authUser } = useAuth();

    useEffect(() => {
        if (authUser?.user?.id) {
            handleLoad();
        }
    }, [authUser]);

    async function handleLoad() {
        setEventData((current) => ({ ...current, authUser: 'pending' }));

        const clubsResponse = await fetch(`${SERVER_API}/users/${authUser?.user.id}/clubs`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (!clubsResponse.ok) {
            setEventData((current) => ({
                ...current,
                state: 'error',
                error: clubsResponse.message,
            }));
            return;
        }
        const clubsArray = await clubsResponse.json();

        let eventsList = [];
        for (let club of clubsArray) {
            const response = await fetch(`${SERVER_API}/events/club/${club.id}`, {
                method: 'GET',
            });
            if (response.status < 400) {
                eventsList.push(await response.json());
            } else {
                setEventData((current) => ({
                    state: 'error',
                    data: current.data,
                    error: response.message,
                }));
                throw new Error(JSON.stringify(response, null, 2));
            }
        }

        setEventData({ state: 'ready', data: eventsList });
    }

    const value = {
        state: eventsObject.state,
        eventsListObject: eventsObject.data || [],
        error: eventsObject.error || null,
        handlerMap: {},
    };

    return (
        <>
            <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
        </>
    );
};

export default EventsProvider;
