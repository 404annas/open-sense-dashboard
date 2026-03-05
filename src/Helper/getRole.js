import { jwtDecode } from 'jwt-decode';

const getRole = () => {
    const userInfoString = localStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

    let userRole = null;
    // 2. Check if userInfo and the token exist.
    if (userInfo) {

        // 3. Decode the token inside a try...catch block for safety.
        try {
            const decodedToken = jwtDecode(userInfo.token);
            console.log(decodedToken, "decoded")
            // 4. Log the entire decoded payload.
            return decodedToken.role
            // You can also log specific parts, like the expiration date

        } catch (error) {
            console.error("Failed to decode token:", error);
        }
    } else {
        return null;

        // console.log("No token found in localStorage.");

    }
}
export default getRole