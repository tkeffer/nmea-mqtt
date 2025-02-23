// mqttClient.js

import mqtt from "mqtt";
import {EventEmitter} from 'events';

class MqttHandler extends EventEmitter {}

export function createMqttClient(brokerUrl, topic) {
    const client = mqtt.connect(brokerUrl);
    const mqttHandler = new MqttHandler();

    client.on('connect', () => {
        console.log('Connected to MQTT broker');
    });

    client.on('error', (error) => {
        console.error(`MQTT Error: ${error}`);
    });

    client.on('close', () => {
        console.error('MQTT connection closed, attempting to reconnect...');
        mqttHandler.emit('reconnect');
    });

    client.on('offline', () => {
        console.error('MQTT client is offline');
    });

    return { client, mqttHandler };
}
