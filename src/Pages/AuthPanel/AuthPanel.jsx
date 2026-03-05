
import { useState } from "react"
import Login from '../../components/Login/Login';
import Signup from '../../components/Signup/Signup';

const AuthPanel = () => {
    const [currentView, setCurrentView] = useState("login") // "login" or "signup"

    // const handleLogin = (loginData) => {
    //     console.log("Login successful:", loginData)
    //     // Here you would typically validate credentials with your backend
    //     onAuthenticated && onAuthenticated(loginData)
    // }

    // const handleSignup = (signupData) => {
    //     console.log("Signup successful:", signupData)
    //     // Here you would typically create account with your backend
    //     onAuthenticated && onAuthenticated(signupData)
    // }
    const switchToSignup = () => setCurrentView("signup")
    const switchToLogin = () => setCurrentView("login")
    const authScreens = [
        {
            view: "login",
            element: <Login onSwitchToSignup={switchToSignup} />
        },
        {
            view: "signup",
            element: <Signup onSwitchToLogin={switchToLogin} />
        },
        {
            view: "foget-pass",
            element: <Login />
        },
    ]
    return (
        <>
            {currentView === "login" ? (
                <Login onSwitchToSignup={switchToSignup} />
            ) : (
                <Signup onSwitchToLogin={switchToLogin} />
            )}
        </>
    )
}

export default AuthPanel
