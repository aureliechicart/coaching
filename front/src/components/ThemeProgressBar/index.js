import React, { useState } from 'react'
import { Progress,  Header } from 'semantic-ui-react'
import '../../styleScss/coaching/themeProgressBar.scss';
const ThemeProgressBar = () => {

  const [percent, setPercent] = useState(80);

    return (
      <div className='theme-presentation'>
        <Header className='header-dashboard' as='h1' textAlign='center'>Titre du theme</Header>
      <div className="progress-container">
        <Progress className='general-progress-bar' percent={percent} indicating progress />
      </div>
      </div>
    )
};

export default ThemeProgressBar;
