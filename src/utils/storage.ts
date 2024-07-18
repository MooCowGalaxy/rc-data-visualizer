export function getAddress() {
    const host = localStorage.getItem('host');
    if (host) return host;

    // set default host
    localStorage.setItem('host', 'http://localhost:5555');
    return 'http://localhost:5555';
}

export function setAddress(host: string) {
    localStorage.setItem('host', host);
}

export function getDataPoints() {
    const dataPoints = localStorage.getItem('numPoints');
    if (dataPoints && !isNaN(parseInt(dataPoints))) return parseInt(dataPoints);

    // set default data points
    localStorage.setItem('numPoints', '250');
    return 250;
}

export function setDataPoints(points: number) {
    localStorage.setItem('dataPoints', points.toString());
}