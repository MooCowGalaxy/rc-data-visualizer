import { useEffect, useRef, useState } from 'react';
import './App.css';
import Navbar from '@/components/Navbar.tsx';
import Graph from '@/components/Graph.tsx';
import { useSocket } from '@/providers/SocketProvider.tsx';
import Scatter from '@/components/Scatter.tsx';

function App() {
    const { socket, dataPoints, dataPaused } = useSocket();
    const [isConnected, setIsConnected] = useState(socket?.connected || false);
    const data = useRef<{ [key: string]: number[] }>({});
    // angle measurements
    const lidarData = useRef<number[] | null>(null);
    const lidarLines = useRef<{ c: string, p: {x: number, y: number}[] }[]>([]);
    const [fields, setFields] = useState<string[]>([]);
    const [renderedList, setRenderedList] = useState<number[]>([]);
    const [renderedLidar, setRenderedLidar] = useState<{ x: number, y: number }[] | null>(null);
    const [renderedLidarLines, setRenderedLidarLines] = useState<{ c: string, p: {x: number, y: number}[] }[]>([]);
    const [renderedLidarAngle, setRenderedLidarAngle] = useState<number[] | null>(null);
    const [lidarSelected, setLidarSelected] = useState<boolean>(false);
    const [selected, setSelected] = useState<string | null>(null);
    const [timer, setTimer] = useState(0);

    const resetData = () => {
        data.current = {};
        lidarData.current = null;
        lidarLines.current = [];
        setRenderedList([]);
        setRenderedLidar(null);
        setFields([]);
        setSelected(null);
        setLidarSelected(false);
    };

    useEffect(() => {
        if (!dataPaused) {
            if (selected) setRenderedList([...data.current[selected]]);

            if (lidarData.current !== null) {
                let points = [];

                // convert imu data from polar to cartesian
                for (let i = 0; i < lidarData.current.length; i++) {
                    const distance = lidarData.current[i];
                    const angle = (i / lidarData.current.length) * 360;
                    const radians = angle * Math.PI / 180;
                    points.push({ x: Math.round(Math.sin(radians) * distance * 100) / 100, y: Math.round(Math.cos(radians) * distance * 100) / 100 });
                }

                setRenderedLidar(points);
                setRenderedLidarLines(lidarLines.current);
                if (data.current['lidar.angle'].length > 0) {
                    const distance = 150;
                    const radians = data.current['lidar.angle'].slice(-1)[0] * Math.PI / 180;
                    setRenderedLidarAngle([Math.round(Math.sin(radians) * distance * 100) / 100, Math.round(Math.cos(radians) * distance * 100) / 100]);
                }
            }
        }
        setFields(Object.keys(data.current).sort((a, b) => {
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            }
            return 0;
        }));
        if (!lidarSelected) {
            setRenderedLidar([]);
        }

        setTimeout(() => {
            setTimer(t => t + 1);
        }, 50);
    }, [timer, dataPaused, selected, lidarSelected]);

    useEffect(() => {
        resetData();
    }, [isConnected]);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onData(value: { t: string, d: number, x: number }) {
            if (!data.current[value.t]) {
                data.current[value.t] = Array(dataPoints).fill(0);
            }

            data.current[value.t].push(value.d);
            if (data.current[value.t].length > dataPoints) data.current[value.t] = data.current[value.t].slice(-dataPoints);
        }

        function onLidar(value: string) {
            lidarData.current = value.split(' ').map(x => parseFloat(x));
        }

        function onLidarLines(value: { data: { c: string, p: {x: number, y: number}[] }[], time: number }) {
            lidarLines.current = value.data;
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('data', onData);
        socket.on('lidar', onLidar);
        socket.on('lidar_lines', onLidarLines);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('data', onData);
            socket.off('lidar', onLidar);
            socket.off('lidar_lines', onLidarLines);
        };
    }, [dataPoints, socket]);

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
        <div className="w-screen h-screen flex flex-col">
            <Navbar reset={resetData} />
            <div className="flex-1 flex flex-row overflow-hidden">
                <div className="w-60 p-4 bg-neutral-100 overflow-y-scroll">
                    {renderedLidar && (
                        <>
                            <div className="mb-2 flex flex-row justify-between items-center">
                                <p>LiDAR</p>
                            </div>
                            <div className={`mb-4 border rounded-lg p-4 cursor-pointer ${lidarSelected ? `bg-sky-300` : ''}`}
                                 onClick={() => setLidarSelected(true)}>
                                <p className="text-lg font-bold">LiDAR Graph</p>
                            </div>
                        </>
                    )}
                    <div className="mb-2 flex flex-row justify-between items-center">
                        <p>Metrics ({fields.length})</p>
                    </div>

                    {fields.map((field, i) => {
                        return (
                            <div key={i} className={`mb-4 border rounded-lg p-4 cursor-pointer ${selected === field && !lidarSelected ? `bg-sky-300` : ''}`} onClick={() => {
                                setSelected(field);
                                setLidarSelected(false);
                            }}>
                                <p className="text-lg font-bold">{field}</p>
                            </div>
                        );
                    })}
                </div>
                {lidarSelected && renderedLidar && (
                    <Scatter data={renderedLidar} linePoint={renderedLidarAngle} lines={renderedLidarLines} />
                )}
                {selected !== null && !lidarSelected ? <div className="flex-1 grid grid-cols-1 gap-y-4">
                    <Graph data={renderedList.map((x, i) => ({ index: i, desktop: x }))} />
                </div> : !lidarSelected ? <div className="flex-1 flex flex-col justify-center items-center">
                    <p>No data selected</p>
                </div> : <></>}
            </div>
        </div>
    );
}

export default App;
