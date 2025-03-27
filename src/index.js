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
        bus.debounceImmediate(debounceTime).onValue(({
                                                         timestamp,
                                                         topic,
                                                         sentence
                                                     }) => {
            mqttClient.publish(topic, JSON.stringify({timestamp, sentence}));
            console.log(`Published: ${topic} ->`, sentence);
        });
    }
    return buses.get(nmeaType);
};

// Connect to the NMEA socket
const client = new net.Socket();
client.connect(options.NMEA_PORT, options.NMEA_HOST,
    () => console.log(`Connected to NMEA server at ${options.NMEA_HOST}:${options.NMEA_PORT}`));

client.on('data', (data) => {
    // Record the time the data was received
    const timestamp = Date.now();
    // It's possible to receive more than one NMEA sentence. Separate them.
    const lines = data.toString().split('\n');
    lines.forEach(line => {
        try {
            const trimmed = line.trim();
            if (trimmed) {
                const sentence = parseNmeaSentence(trimmed);
                const topic = `${options.MQTT_TOPIC_PREFIX}/${sentence.sentenceId}`;
                const bus = getBusForType(sentence.sentenceId);
                bus.push({timestamp, topic, sentence});
            }
        } catch (err) {
            console.warn('Invalid NMEA sentence:', line);
        }
    });
});

client.on('error', (err) => console.error('NMEA Socket Error:', err));
client.on('close', () => console.log('NMEA connection closed.'));
