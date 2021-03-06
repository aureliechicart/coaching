import React, { useEffect } from 'react'
import { Progress, Header } from 'semantic-ui-react'
import '../../styles/ThemeProgressBar.css';
import axios from 'axios';



const ThemeProgressBar = ({
  title,
  description,
  id,
  base_url, 
  themeScore,
  setThemeScore,
  userInteraction,
  userId,
}) => {


  const computeThemeScore = () => {
    console.log('COMPUTE THEME SCORE');
    axios.get(`${base_url}/v1/api/students/${userId}/themes/${id}/score`)
      .then((response)=> {
        console.log('SCORE', response.data);
        setThemeScore(response.data);  
      }).catch((err => {
        console.log(err)
        console.log("erreur themeProgressBar")
      }))
  }
  
  useEffect(() => {
    computeThemeScore();
  },[id, userInteraction])

    return (
      <div className='theme-presentation'>
        <Header className='theme-title' as='h1' textAlign='center'>{title}</Header>
        <div className="theme-progress-container">
          <Progress className='theme-progress-bar' percent={themeScore.bytheme_ratio} indicating progress />
        </div>
        <div className="description-theme">
          <p>
            {description}
          </p>
        </div>
      </div>
    )
};

export default ThemeProgressBar;
