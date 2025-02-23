// index.js

import {parseNMEASentence} from './nmeaParser.js';
import {createMqttClient} from './mqttClient.js';
import {listenForNMEASentences} from "./nmeaListener.js";

// Configuration
const NMEA_PORT = 60001; // Port to listen for NMEA sentences
const NMEA_HOST = '192.168.2.226'; // Host to listen for NMEA sentences
const MQTT_BROKER_URL = 'mqtt://localhost'; // MQTT Broker URL
const MQTT_TOPIC = 'nmea/sentences'; // MQTT Topic to publish NMEA sentences

// Create MQTT client and handle reconnection
let { client: mqttClient, mqttHandler } = createMqttClient(MQTT_BROKER_URL, MQTT_TOPIC);

// Listen for NMEA sentences and publish to MQTT
listenForNMEASentences(NMEA_HOST, NMEA_PORT, (sentence) => {
    try {
        const parsedSentence = parseNMEASentence(sentence);
        mqttClient.publish(MQTT_TOPIC, JSON.stringify(parsedSentence));
    } catch (error) {
        console.error(`Error parsing NMEA sentence: ${error.message}`);
    }
});

// Handle MQTT reconnection
mqttHandler.on('reconnect', () => {
    mqttClient.end(true, () => {
        const mqttClientInfo = createMqttClient(MQTT_BROKER_URL, MQTT_TOPIC);
        mqttClient = mqttClientInfo.client;
        mqttHandler = mqttClientInfo.mqttHandler;
    });
});
