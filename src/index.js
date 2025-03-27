import net from 'net';
import mqtt from 'mqtt';
import * as Bacon from 'baconjs';
import {parseNmeaSentence} from 'nmea-simple';

import {options} from './config.js';

// MQTT Client
const mqttClient = mqtt.connect(options.MQTT_BROKER, {
    username: options.mqtt_username,
    password: options.mqtt_password
});
mqttClient.on('connect', () => console.log('Connected to MQTT broker.'));

// Create a map to store Bacon.js buses for each NMEA sentence type
const buses = new Map();

// Function to get or create a Bacon bus for an NMEA sentence type
const getBusForType = (nmeaType) => {
    if (!buses.has(nmeaType)) {
        const bus = new Bacon.Bus();
        buses.set(nmeaType, bus);
        const debounceTime = options.DEBOUNCE_INTERVALS[nmeaType] || options.DEFAULT_DEBOUNCE_INTERVAL;
        bus.debounceImmediate(debounceTime).onValue(({topic, message}) => {
            mqttClient.publish(topic, JSON.stringify(message));
            console.log(`Published: ${topic} ->`, message);
        });
    }
    return buses.get(nmeaType);
};

// Connect to the NMEA socket
const client = new net.Socket();
client.connect(options.NMEA_PORT, options.NMEA_HOST, () =>
    console.log(`Connected to NMEA server at ${options.NMEA_HOST}:${options.NMEA_PORT}`));

client.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
        try {
            const trimmed = line.trim();
            if (trimmed) {
                const parsed = parseNmeaSentence(trimmed);
                const topic = `${options.MQTT_TOPIC_PREFIX}/${parsed.sentenceId}`;
                const bus = getBusForType(parsed.sentenceId);
                bus.push({topic, message: parsed});
            }
        } catch (err) {
            console.warn('Invalid NMEA sentence:', line);
        }
    });
});

client.on('error', (err) => console.error('NMEA Socket Error:', err));
client.on('close', () => console.log('NMEA connection closed.'));
