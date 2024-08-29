import Lottie from 'lottie-react';
import loginanimation from '../resources/loginIllustration.json';
import error from '../resources/error.json';

function LoginAnimation({ label }) {
    return label === 'login' ? <Lottie animationData={loginanimation} loop={false}/> : <Lottie animationData={error} loop={false}/>;
}

export default LoginAnimation;