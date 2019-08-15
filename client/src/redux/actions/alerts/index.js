import expressServer from '../../../api';
import { navigate } from 'hookrouter';

export const clientAlertError = alert => {
    return { type: "LOG_ERROR", payload: alert }
}