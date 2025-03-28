/*
 * Configuration file for nmea-mqtt
 *
 * DO NOT EDIT THIS FILE!
 *
 * Instead, copy it, then edit the copy:
 *     cp config-sample.js config.js
 *     nano config.js
 */

export const options = {
    // Change to your NMEA data source:
    NMEA_HOST: '127.0.0.1',
    // Change to your NMEA port:
    NMEA_PORT: 10110,
    MQTT_BROKER: 'mqtt://localhost',
    MQTT_TOPIC_PREFIX: 'nmea',
    DEFAULT_DEBOUNCE_INTERVAL: 10000, // Default 10 seconds
    // The username and password as required by the MQTT broker, if any
    mqtt_username: undefined,
    mqtt_password: undefined,


    // Custom debounce intervals per sentence type
    DEBOUNCE_INTERVALS: {
        GGA: 5000,
        RMC: 5000,
        VTG: 7000,
        GSA: 5000,
    },
}
