// nmeaListener.js

import net from 'net';

export function listenForNMEASentences(host, port, callback) {
    const client = new net.Socket();

    client.connect(port, host, () => {
        console.log(`Connected to NMEA server at ${host}:${port}`);
    });

    client.on('data', (data) => {
        const sentences = data.toString().split('\n');
        sentences.forEach((sentence) => {
            const trimmedSentence = sentence.trim();
            if (trimmedSentence) {
                callback(trimmedSentence);
            }
        });
    });

    client.on('error', (error) => {
        console.error(`NMEA socket error: ${error.message}`);
    });

    client.on('close', () => {
        console.error('NMEA socket connection closed');
    });

    return client;
}
