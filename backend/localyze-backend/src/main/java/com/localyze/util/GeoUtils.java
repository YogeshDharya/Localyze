package com.localyze.util;

/**
 * Utility class for geographic calculations.
 */
public final class GeoUtils {

    private static final double EARTH_RADIUS_KM = 6371.0;

    private GeoUtils() {
        // Prevent instantiation
    }

    /**
     * Calculates the great-circle distance between two points on Earth
     * using the Haversine formula.
     *
     * @param lat1 latitude of point 1 in degrees
     * @param lon1 longitude of point 1 in degrees
     * @param lat2 latitude of point 2 in degrees
     * @param lon2 longitude of point 2 in degrees
     * @return distance in kilometers
     */
    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }
}
