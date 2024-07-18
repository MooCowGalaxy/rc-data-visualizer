import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import Navbar from '@/components/Navbar.tsx';
import Graph from '@/components/Graph.tsx';
import { useSocket } from '@/providers/SocketProvider.tsx';

function App() {
    const { socket, dataPoints, dataPaused } = useSocket();
    const [isConnected, setIsConnected] = useState(socket?.connected || false);
    const data = useRef<{ [key: string]: number[] }>({});
    const [rendered, setRendered] = useState<{ [key: string]: number[] }>({});
    const [fields, setFields] = useState<string[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [timer, setTimer] = useState(0);

    const sortedFields = useMemo(() => {
        return fields.sort((a, b) => {
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            }
            return 0;
        });
    }, [fields]);

    const resetData = () => {
        data.current = {};
        setRendered({});
        setSelected(null);
    };

    useEffect(() => {
        setTimeout(() => {
            setTimer(t => t + 1);
            setRendered(data.current);
        }, 50);
    }, [timer]);

    useEffect(() => {
        resetData();
    }, [isConnected]);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(true);
        }

        function onData(value: { t: string, d: number, x: number }) {
            if (dataPaused) return;

            if (!data.current[value.t]) {
                data.current[value.t] = Array(dataPoints).fill(0);
                setFields(f => [...f, value.t]);
            }

            data.current[value.t].push(value.d);
            if (data.current[value.t].length > dataPoints) data.current[value.t] = data.current[value.t].slice(-dataPoints);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('data', onData);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('foo', onData);
        };
    }, [dataPaused, dataPoints, socket]);

    useEffect(() => {
        for (const [key, value] of Object.entries(data.current)) {
            if (value.length > dataPoints) data.current[key] = value.slice(-dataPoints);
            else if (value.length < dataPoints) data.current[key] = [...Array(dataPoints - value.length).fill(0), ...value];
        }
    }, [dataPoints]);

    if (!isConnected) {
        return (
            <div className="w-screen h-screen flex flex-col">
                <Navbar reset={resetData} />
                <div className="flex-1 flex flex-col justify-center items-center">
                    <p>Disconnected</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-w-screen min-h-screen flex flex-col">
            <Navbar reset={resetData} />
            <div className="flex-1 flex flex-row">
                <div className="w-60 p-4 bg-neutral-100">
                    <div className="mb-2 flex flex-row justify-between items-center">
                        <p>Metrics ({fields.length})</p>
                    </div>

                    {sortedFields.map(field => {
                        return (
                            <div className={`mb-4 border rounded-lg p-4 cursor-pointer ${selected === field ? `bg-sky-300` : ''}`} onClick={() => setSelected(field)}>
                                <p className="text-lg font-bold">{field}</p>
                            </div>
                        );
                    })}
                </div>
                {selected !== null ? <div className="flex-1 grid grid-cols-1 gap-y-4">
                    <Graph data={rendered[selected].map((x, i) => ({ index: i, desktop: x }))} />
                </div> : <div className="flex-1 flex flex-col justify-center items-center">
                    <p>No data selected</p>
                </div>}
            </div>
        </div>
    );
}

export default App;
