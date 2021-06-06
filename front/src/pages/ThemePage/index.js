import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom'
import { Card } from 'semantic-ui-react';
// import 'src/styles/ThemePage.css';
import axios from 'axios';
import Mission from 'src/components/Mission';
import ThemeProgressBar from '../../components/ThemeProgressBar';

const ThemePage = ({
  base_url,
  missionByTheme,
  setMissionByTheme,
  setMissionByThemeUser,
  theme,
  setTheme,
  userInteraction,
  setUserInteraction,
  userId
}) => {
  
  const[themeScore,setThemeScore] = useState(0);

  const { idTheme } = useParams();
  

  //il faut appeller les missions pour un theme demandé.
  // double axios prévu, 1er récupérer toutes les missions pa theme


  const loadMissionByThemeWithInteract = () => {

    axios.get(`${base_url}/v1/api/themes/${idTheme}/missions`)
      .then((response)=> {
        console.log("SETMISSIONBYTHEME :", response.data )
        setMissionByTheme(response.data);
      }).catch((err => {
        console.log(err)
      })).finally(() => {
        axios.get(`${base_url}/v1/api/themes/${idTheme}/users/${userId}`)
        .then((response)=> {
          console.log("SetMissionByThemeUser :", response.data )
          setMissionByThemeUser(response.data)
        }).catch((err => {
          console.log(err)
        
      }
      ))})

  }


  const getSelectedTheme = () => { 
    axios.get(`${base_url}/v1/api/themes/${idTheme}`)
    .then((response)=> {
      console.log("SETMISSIONBYTHEME :", response.data )
      setTheme(response.data);
    }).catch((err => {
      console.log(err)
    }))
  
  }



  useEffect(()=> {
    console.log('USE EFFECT THEME PAGE');
    loadMissionByThemeWithInteract();
  },[userInteraction]);

  useEffect(()=> {
    getSelectedTheme();
  },[]);


  return (
    <div className="missions">

      <ThemeProgressBar 
        {...theme}
        userInteraction={userInteraction}
        setThemeScore={setThemeScore}
        themeScore={themeScore}
        userId={userId}
        base_url={base_url}
      />

      {/* <Divider /> */}
      
      <Card.Group 
        className='mission-card-container'
      >
        {missionByTheme.map((mission) => (

          <Mission 
          key={mission.id}
          name={mission.id}
          {...mission}
          userId={userId} 
          userInteraction={userInteraction}
          setUserInteraction={setUserInteraction}
          base_url={base_url}
          />
        ))}
      </Card.Group>
     
    </div>
  )
}

export default ThemePage
