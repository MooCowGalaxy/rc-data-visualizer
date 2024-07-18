import { Package2 } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { useEffect, useState } from 'react';
import { useSocket } from '@/providers/SocketProvider.tsx';
import SettingsDialog from '@/components/SettingsDialog.tsx';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label.tsx';

export default function Navbar({ reset }: { reset: () => void }) {
    const { socket, dataPaused, setDataPaused } = useSocket();
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const onConnect = () => {
            setConnected(true);
        };

        const onDisconnect = () => {
            setConnected(false);
        };

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, [socket]);

    const connect = () => {
        socket.connect();
    };

    const disconnect = () => {
        socket.disconnect();
    };

    return (
        <header
            className="z-50 flex-initial sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <nav
                className="w-full gap-6 font-medium flex flex-row justify-between text-sm">
                <div className="flex items-center gap-2 text-lg font-semibold md:text-base">
                    <Package2 className="h-6 w-6"/>
                    <span>RC Data</span>
                    {connected
                        ? <div className="ml-4 px-2 py-0.5 flex flex-row items-center rounded-full border border-green-700 text-sm"><div className="rounded-full bg-green-500 p-2 h-min mr-1" /> Connected</div>
                        : <div className="ml-4 px-2 py-0.5 flex flex-row items-center rounded-full border border-red-700 text-sm"><div className="rounded-full bg-red-500 p-2 h-min mr-1" /> Disconnected</div>}
                </div>
                <div className="flex gap-4 items-center">
                    {!connected
                        ? <Button onClick={connect}>Connect</Button>
                        : <>
                            <div className="flex items-center mr-2">
                                <Switch className="mr-2" id="data-paused" checked={dataPaused} onCheckedChange={setDataPaused} />
                                <Label htmlFor="data-paused">Pause Data Collection</Label>
                            </div>
                            <Button onClick={reset}>Clear Data</Button>
                            <Button onClick={disconnect}>Disconnect</Button>
                        </>}
                    <SettingsDialog />
                </div>
            </nav>
        </header>
    );
}