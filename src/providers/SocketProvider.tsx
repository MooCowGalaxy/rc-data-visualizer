import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAddress, setAddress, getDataPoints, setDataPoints } from '@/utils/storage.ts';
import { Socket, io } from 'socket.io-client';

type SocketContextType = {
    address: string;
    setAddress: (address: string) => void;
    dataPoints: number;
    setDataPoints: (points: number) => void;
    dataPaused: boolean;
    setDataPaused: (value: boolean) => void;
    socket: Socket;
};

const SocketContext = createContext<SocketContextType>({
    address: getAddress(),
    setAddress: () => {},
    dataPoints: getDataPoints(),
    setDataPoints: () => {},
    dataPaused: false,
    setDataPaused: () => {},
    socket: io(getAddress())
});

// eslint-disable-next-line react-refresh/only-export-components
export function useSocket() {
    return useContext(SocketContext);
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socketAddress, setSocketAddress] = useState<string>(getAddress());
    const [points, setPoints] = useState<number>(getDataPoints());
    const [socket, setSocket] = useState<Socket>(io(getAddress()));
    const [dataPaused, setDataPaused] = useState(false);

    useEffect(() => {
        setSocket(socket => {
            try {
                socket.disconnect();
            } catch (e) { /* empty */ }
            setDataPaused(false);
            return io(socketAddress);
        });
    }, [socketAddress]);

    useEffect(() => {
        setSocketAddress(getAddress());
        setPoints(getDataPoints());
    }, []);

    const updateAddress = (address: string) => {
        setAddress(address);
        setSocketAddress(address);
    };

    const updateDataPoints = (dataPoints: number) => {
        setDataPoints(dataPoints);
        setPoints(dataPoints);
    };

    const value = {
        address: socketAddress,
        setAddress: updateAddress,
        dataPoints: points,
        setDataPoints: updateDataPoints,
        dataPaused,
        setDataPaused,
        socket: socket
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}