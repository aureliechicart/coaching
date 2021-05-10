import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom'
import {  Divider } from 'semantic-ui-react';
import '../../styles/ThemePage.css';
import ThemeProgressBar from 'src/components/ThemeProgressBar';
import AccordionComponent from 'src/components/AccordionComponent';
import axios from 'axios'

const ThemePage = ({ themes, selectedTheme, setSelectedTheme }) => {
  
  const [missions, setMissions] = useState([]);
  

  console.log('la liste des thèmes:', themes);
  const { id } = useParams();
  console.log(id);
  const theme = themes.find((theme) => theme.id == id);
  console.log(theme);




  const loadMissions = () => {
    console.log(`http://localhost:3000/v1/api/themes/${id}/missions`)
    axios.get(`http://localhost:3000/v1/api/themes/${id}/missions`)
      .then((response) => {
        // console.log(response.data);
        setMissions(response.data);
      })
      .catch((error) => {
        // exécuté quand la réponse arrive, si la réponse est un échec
        // console.log(error);

        // TODO il faudrait afficher l'information à l'utilisateur
      })

  };

  useEffect(() => {
    loadMissions();
    // setSelectedTheme(result);
  },[]);

  



  return (
    <div className="missions">
      <ThemeProgressBar {...theme} />
      <Divider />
      <AccordionComponent missions={missions}/>
    </div>
  )
}

export default ThemePage