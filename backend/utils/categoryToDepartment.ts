import { complaint_category, department_type } from "@prisma/client";

export const categoryToDepartment: Record<complaint_category, department_type> = {
  // Sanitation
  Garbage_Collection:               "Sanitation_Department",

  // Drainage & Water
  Drainage_Issue:                  "Sanitation_Department",
  Water_Supply_Disruption:        "Water_Supply_Department",
  Water_Leakage:                  "Water_Supply_Department",

  // Electricity
  Electricity_Outage:             "Electricity_Department",
  Street_Light_Issue:             "Electricity_Department",

  // Roads
  Potholes___Road_Damage:         "Roads___Infrastructure_Department",
  Broken_Footpath:                "Roads___Infrastructure_Department",

  // Town Planning
  Unauthorized_Construction:      "Building___Town_Planning_Department",

  // Health
  Public_Health_Hazard:           "Public_Health_Department",

  // Property Tax
  Incorrect_Property_Tax_Bill:    "Revenue___Property_Tax_Department",

  // Fire
  Fire_Safety_Violation:          "Fire___Emergency_Services",

  // Environment
  Pollution_Complaint:            "Environmental_Department",
  Deforestation_Issue:            "Environmental_Department",

  // Transport
  Traffic_Signal_Issue:           "Transport___Traffic_Department",
  Parking_Violation:              "Transport___Traffic_Department",

  // Public Works
  Damaged_Public_Facilities:      "Public_Works_Department",

  // Trade
  Illegal_Trade_Activity:         "Licensing___Trade_Department",
};
