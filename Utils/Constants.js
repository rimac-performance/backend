const ERROR_DESC = {
    NOT_FOUND: "The requested resource was not found or empty!",
    NO_RESOURCE: "Sorry can't find that resource!",
    TOKEN_NOT_FOUND: "token not found",
    INVALID_FIELD: "invalid parameters",
    MISSING_FIELD: "missing parameters",
    WRONG_PASSWORD: "please check your password",
    USER_NOT_FOUND: "user not found",
    INVALID_TOKEN: "token invalid or expired",
    EMAIL_OR_PASSWORD: "email or password invalid'",
    NOT_LOGGEDIN: "you must be logged in to do that!",
    SUCCESS: "success",
    FAILED: "Not your fault!",
    PASSWORD_MISMATCH: "password does not match",
    INCORRECT_PASSWORD_COMPLEXITY:
        "password should be 8 charachters long, and contain at least 1 number",
    INVALID_EMAIL: "email is invalid!",
    USER_ALREADY_EXISTS: "user already exists!",
    CAR_ALREADY_EXISTS: "car already exists!",
    DUPLICATE: "duplicate entry",
    TOKEN_EXPIRED: "token expired",
    PASSWORD_RESET: "reset your password",
    ACTIVATE_ACCOUNT: "activate your account",
    JWT_UNAUTHORIZED: "Unauthorized Error",
    JWT_EXPIRED: "Expired token provided!",
    MISSING_TOKEN: "No authorization token was found",
    MISSING_TOKEN_MESSAGE: "missing authorization token",
    INVALID_PHONE_LENGTH: "invalid phone length",
    EMAIL: "There was an error sending the email!",
    INVALID_YEAR: "Year of car must be between 2009-9999!",
    UNAUTHORIZED: "not authorized"
};

const APP_ERROR_CODE = Object.freeze({
    USER_EXISTS: 1,
    PASSWORD_MISMATCH: 2,
    INCORRECT_PASSWORD_COMPLEXITY: 3,
    DUPLICATE: 4,
    MISSING_FIELD: 5,
    INVALID_FIELD: 6,
    TOKEN_EXPIRED: 7,
    TOKEN_NOT_FOUND: 8,
    INVALID_EMAIL_OR_PASSWORD: 9,
    NOT_FOUND: 10,
    NO_CONTENT: 11,
    MISSING_TOKEN: 12,
    ACCOUNT_ALREADY_VERIFIED: 13,
    EDITOR_NOT_FOUND: 14,
    UNAUTHORIZED: 15,
    EMAIL: 16,
    TIME: 17,
    FILE_TYPE: 18,
    FILE_SIZE: 19,
    INVALID_TOKEN: 20,
    CAR_EXISTS: 20,
    UNKNOWN_ERROR: -1,
});

const ERROR_CODE = {
    NOT_FOUND: 404,
    NO_DATA_FOUND: 403,
    INVALID_MISSING_PARAMETER: 422,
    SUCCESS: 200,
    NO_CONTENT: 204,
    FAILED: 500,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    CONFLICT: 409
};

const runColumns = ['mean_BCU_F_ST:BCU_F_wipers_speed_ST', 'mean_BFI_RL_temp_1:BFI_temp_sw_max', 'mean_BFI_RL_temp_2:BFI_temp_motor_1', 'mean_BFI_RL_temp_2:BFI_temp_motor_2', 'mean_BFI_RL_temp_2:BFI_temp_motor_3', 'mean_BFI_RR_temp_1:BFI_temp_sw_max', 'mean_BFI_RR_temp_2:BFI_temp_motor_1', 'mean_BFI_RR_temp_2:BFI_temp_motor_2', 'mean_BFI_RR_temp_2:BFI_temp_motor_3', 'mean_CCU_F_ST:CCU_F_AC_ON_ST', 'mean_CCU_F_ST:CCU_F_AC_fan_speed_ST', 'mean_CCU_F_temp_1:CCU_F_ambient_temp', 'mean_CCU_F_temp_1:CCU_F_evaporator_temp', 'mean_CCU_F_temp_1:CCU_F_heating_inlet_temp', 'mean_CCU_F_temp_1:CCU_F_heating_outlet_temp', 'mean_CCU_F_temp_1:CCU_F_interior_temp', 'mean_CCU_R_temp_1:CCU_R_batt_coolant_in_temp', 'mean_CCU_R_temp_1:CCU_R_batt_coolant_out_temp', 'mean_HPI_FL_inverter_temp:HPI_temp_IGBT1', 'mean_HPI_FL_inverter_temp:HPI_temp_IGBT2', 'mean_HPI_FL_inverter_temp:HPI_temp_IGBT3', 'mean_HPI_FL_phase_curr_motor_temp:HPI_temp_motor1', 'mean_HPI_FL_phase_curr_motor_temp:HPI_temp_motor2', 'mean_HPI_FR_inverter_temp:HPI_temp_IGBT1', 'mean_HPI_FR_inverter_temp:HPI_temp_IGBT2', 'mean_HPI_FR_inverter_temp:HPI_temp_IGBT3', 'mean_HPI_FR_phase_curr_motor_temp:HPI_temp_motor1', 'mean_HPI_FR_phase_curr_motor_temp:HPI_temp_motor2', 'mean_PCU_IVI_FB_2:PCU_vehicle_range', 'mean_PCU_power_LIM:PCU_drive_power_LIM', 'mean_PCU_power_LIM:PCU_drive_power_available', 'mean_PCU_power_LIM:PCU_regen_power_LIM', 'mean_PDU_BMS_cell_min_max_vals:PDU_cell_temp_max', 'mean_PDU_BMS_cell_min_max_vals:PDU_cell_temp_min', 'mean_PDU_BMS_cell_min_max_vals:PDU_cell_voltage_max', 'mean_PDU_BMS_cell_min_max_vals:PDU_cell_voltage_min', 'mean_PDU_HV_LV_status:PDU_HV_battery_SOC', 'mean_PDU_HV_LV_status:PDU_HV_battery_SOH', 'mean_PDU_HV_battery_performance:PDU_HV_battery_current', 'mean_PDU_HV_battery_performance:PDU_HV_battery_voltage', 'mean_PDU_HV_consumptions:PDU_HV_batt_consumption_charged', 'mean_PDU_HV_consumptions:PDU_HV_batt_consumption_regen', 'mean_PDU_HV_consumptions:PDU_HV_batt_consumption_total', 'mean_PDU_HV_energy:PDU_HV_battery_SOE', 'mean_PDU_HV_energy:PDU_HV_battery_energy_available', 'mean_SAFETY_PCU_ST:PCU_vehicle_output_power', 'mean_SAFETY_PCU_knobs_ST:PCU_PRND_mode_ST', 'mean_SAFETY_PCU_vehicle_ST:PCU_accelerator_pedal', 'mean_SAFETY_PCU_vehicle_ST:PCU_vehicle_mileage', 'mean_SAFETY_PCU_vehicle_ST:PCU_vehicle_speed', 'mean_SAFETY_VCU_vehicle_ST:VCU_vehicle_ST', 'mean_SCU_PSG_ST:SCU_PSG_seat_occupied', 'mean_gps:pos_altitude', 'mean_gps:pos_heading', 'mean_gps:pos_latitude', 'mean_gps:pos_longitude']

module.exports = {
    ERROR_DESC,
    APP_ERROR_CODE,
    ERROR_CODE,
    runColumns
}