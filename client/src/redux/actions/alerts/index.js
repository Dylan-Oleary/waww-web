export const clientAlertError = alert => {
    return { type: "LOG_ERROR", payload: alert }
}