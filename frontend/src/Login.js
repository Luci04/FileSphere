import React from 'react'
import { GoogleLogin } from '@react-oauth/google';
import video from './assets/mixkit-raft-going-slowly-down-a-river-1218-medium.mp4'

function Login() {
    return (
        <div className="video-background">
            <video autoPlay muted loop>
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className='absolute-element'>
                <GoogleLogin
                    onSuccess={credentialResponse => {
                        console.log(credentialResponse);
                    }}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />
            </div>

        </div>

        // </div>
    )
}


export default Login