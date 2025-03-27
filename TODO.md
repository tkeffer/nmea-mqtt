Need to filter output to specified NMEA sentence types.

Many values can come from multiple sources. Need a way to pick which one.
But, that's the subscriber's problem.

Refactor JSON packet to something less verbose.

Need to include MMSI in topic. E.g, `nmea/368323170/HDT`, where `368323170` is
the MMSI of _Western Flyer_.

Missing NMEA sentences:
$HETHS,269.9,D*2C                   # Proprietary
$IIMDA,30.1,I,1.019,B,14.8,C,,C,,,,C,322.79,T,,M,3.09,N,1.59,M*26 # Atmospheric temperature and pressure
$IIRSA,-4.9,A,,V*59                 # Rudder sensor angle
$IIVBW,,,V,0,0,A,,V,-0,A*5E         # Dual ground/water speed
$TIROT,0.99,A*0B                    # Rate of turn
$WIMWD,324.89,T,,M,,N,,M*40         # Wind direction & speed
$WIVWR,46.8,R,3.1,N,1.6,M,5.7,K*6A  # Relative wind speed and angle
