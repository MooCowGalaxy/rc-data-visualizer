import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog.tsx';
import { Settings } from 'lucide-react';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import { useSocket } from '@/providers/SocketProvider.tsx';
import { Button } from '@/components/ui/button.tsx';

export default function SettingsDialog() {
    const { address, setAddress, dataPoints, setDataPoints } = useSocket();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [inputAddress, setInputAddress] = useState<string>(address);
    const [inputPoints, setInputPoints] = useState<number>(dataPoints);

    const onAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputAddress(e.target.value);
    };

    const onPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputPoints(parseInt(e.target.value));
    };

    const onSave = () => {
        setAddress(inputAddress);
        setDataPoints(inputPoints);
        setDialogOpen(false);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger><Settings size="20px" /></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>Change your data source URL or number of data points to display here.</DialogDescription>
                    <div className="grid gap-4 pt-4">
                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                type="text"
                                placeholder="http://localhost:5555"
                                required
                                value={inputAddress}
                                onChange={onAddressChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="points">Data point history</Label>
                            <Input
                                id="points"
                                type="number"
                                min={100}
                                max={1000}
                                placeholder="500"
                                required
                                value={inputPoints}
                                onChange={onPointsChange}
                            />
                        </div>
                        <Button onClick={onSave}>Save</Button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}