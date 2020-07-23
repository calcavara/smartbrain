import React from 'react';
import './Navigation.css'

const Navigation = ( { onRouteChange, isSignedIn } ) => {
    return (
        isSignedIn ?
        <nav>
            <ul className='flex list pl0'>
                <li onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 pointer'>Sign Out</li>
            </ul>
        </nav>
        :
        <nav>
            <ul className='flex list pl0'>
                <li onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 pointer'>Sign In</li>
                <li onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer'>Register</li>
            </ul>
        </nav>
    );
}

export default Navigation;