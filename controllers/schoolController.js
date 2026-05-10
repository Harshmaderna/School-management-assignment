import School from "../model/shoolModel.js";

// Haversine Formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// ADD SCHOOL API

export const addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || latitude == null || longitude == null) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude must be numbers",
      });
    }

    const school = await School.create({
      name,
      address,
      latitude,
      longitude,
    });

    return res.status(201).json({
      success: true,
      message: "School added successfully",
      data: school,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// LIST SCHOOLS API
export const listSchools = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    // Validation
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required",
      });
    }

    const schools = await School.findAll();

    // Distance calculate and sort
    const sortedSchools = schools
      .map((school) => {
        const distance = calculateDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          school.latitude,
          school.longitude,
        );

        return {
          ...school.toJSON(),
          distance: `${distance.toFixed(2)} KM`,
        };
      })
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    return res.status(200).json({
      success: true,
      count: sortedSchools.length,
      data: sortedSchools,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
