import React, {useState, useEffect} from 'react';
// bibliothèque pour faciliter les appels AJAX (en utilisant des Promise)
import '../../styles/GestionThemes.css';
import ThemeCard from 'src/components/ThemeCard/ThemeCard.js';
import NewModalTheme from 'src/components/NewModalTheme/NewModalTheme.js';
//== Import from Semantic UI
import { Card } from 'semantic-ui-react';



const GestionThemes = ({
  themes, 
  setRefresh, 
  refresh, 
  base_url,
  setSearchedText
}) => {
  const [iconPlus,setIconPlus] = useState('plus square');

  useEffect(() => {
    window.scrollTo(0, 0)
    setSearchedText('')
  }, [])

  return (
    <div className="themesGestion">
      <NewModalTheme setRefresh={setRefresh} base_url={base_url}/>
      <Card.Group centered>
        {themes.map((theme)=> (
          <div key={theme.id} className="theme-card-container">

            <ThemeCard
              iconPlus={iconPlus}
              name={theme.id}
              {...theme}
              refresh={refresh}
              setRefresh={setRefresh}
              base_url={base_url}
            />
          </div>
        ))}
      </Card.Group>
    </div>
  );
};

// == Export
export default GestionThemes;
