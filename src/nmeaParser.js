// nmeaParser.js
import nmea from 'nmea-simple';

export function parseNMEASentence(sentence) {
    const packet = nmea.parseNmeaSentence(sentence);
    delete packet.sentenceName;
    return packet;
}

// export function parseNMEASentence(sentence) {
//     if (sentence.charAt(0) !== '$') {
//         throw new Error("Invalid NMEA sentence");
//     }
//
//     const [data, checksum] = sentence.split('*');
//     const dataWithoutDollar = data.substring(1);
//     let calculatedChecksum = 0;
//     for (let i = 0; i < dataWithoutDollar.length; i++) {
//         calculatedChecksum ^= dataWithoutDollar.charCodeAt(i);
//     }
//
//     if (calculatedChecksum !== parseInt(checksum, 16)) {
//         throw new Error("Checksum mismatch");
//     }
//
//     const fields = dataWithoutDollar.split(',');
//     const talkerId = fields[0].substring(0, 2);
//     const sentenceType = fields[0].substring(2,5);
//     const parsedData = {
//         sentenceType: sentenceType,
//         fields: fields.slice(1)
//     };
//
//     // Example: Further parsing based on sentence type
//     if (sentenceType === 'GGA') {
//         parsedData.time = fields[1];
//         parsedData.latitude = fields[2];
//         parsedData.latitudeDirection = fields[3];
//         parsedData.longitude = fields[4];
//         parsedData.longitudeDirection = fields[5];
//         parsedData.fixQuality = fields[6];
//         parsedData.numSatellites = fields[7];
//         parsedData.horizontalDilution = fields[8];
//         parsedData.altitude = fields[9];
//         parsedData.altitudeUnits = fields[10];
//     } else if (sentenceType === 'RMC') {
//         parsedData.time = fields[1];
//         parsedData.status = fields[2];
//         parsedData.latitude = fields[3];
//         parsedData.latitudeDirection = fields[4];
//         parsedData.longitude = fields[5];
//         parsedData.longitudeDirection = fields[6];
//         parsedData.speedOverGround = fields[7];
//         parsedData.courseOverGround = fields[8];
//         parsedData.date = fields[9];
//     }
//
//     return parsedData;
// }
