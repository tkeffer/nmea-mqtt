import net from 'net';
import mqtt from 'mqtt';
import * as Bacon from 'baconjs';
import { parseNmeaSentence } from 'nmea-simple';

// Configuration
const NMEA_HOST = '127.0.0.1'; // Change to your NMEA data source
const NMEA_PORT = 10110; // Change to your NMEA port
const MQTT_BROKER = 'mqtt://localhost';
const MQTT_TOPIC_PREFIX = 'nmea';
const DEFAULT_DEBOUNCE_INTERVAL = 10000; // Default 10 seconds

// Custom debounce intervals per sentence type
const DEBOUNCE_INTERVALS = {
    GGA: 5000,  // Example: 5 seconds for GGA
    RMC: 15000, // Example: 15 seconds for RMC
    VTG: 7000,  // Example: 7 seconds for VTG
    GSA: 5000,
};

// MQTT Client
const mqttClient = mqtt.connect(MQTT_BROKER);
mqttClient.on('connect', () => console.log('Connected to MQTT broker.'));

// Create a map to store Bacon.js buses for each NMEA sentence type
const buses = new Map();

// Function to get or create a Bacon bus for an NMEA sentence type
const getBusForType = (nmeaType) => {
    if (!buses.has(nmeaType)) {
        const bus = new Bacon.Bus();
        buses.set(nmeaType, bus);
        const debounceTime = DEBOUNCE_INTERVALS[nmeaType] || DEFAULT_DEBOUNCE_INTERVAL;
        bus.debounceImmediate(debounceTime).onValue(({ topic, message }) => {
            mqttClient.publish(topic, JSON.stringify(message));
            console.log(`Published: ${topic} ->`, message);
        });
    }
    return buses.get(nmeaType);
};

// Connect to the NMEA socket
const client = new net.Socket();
client.connect(NMEA_PORT, NMEA_HOST, () => console.log(`Connected to NMEA server at ${NMEA_HOST}:${NMEA_PORT}`));

client.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
        try {
            const trimmed = line.trim();
            if (trimmed) {
                const parsed = parseNmeaSentence(trimmed);
                const topic = `${MQTT_TOPIC_PREFIX}/${parsed.sentenceId}`;
                const bus = getBusForType(parsed.sentenceId);
                bus.push({ topic, message: parsed });
            }
        } catch (err) {
            console.warn('Invalid NMEA sentence:', line);
        }
    });
});

client.on('error', (err) => console.error('NMEA Socket Error:', err));
client.on('close', () => console.log('NMEA connection closed.'));
