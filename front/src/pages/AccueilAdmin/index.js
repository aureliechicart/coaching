import React, { useState, useEffect } from 'react';
// bibliothèque pour faciliter les appels AJAX (en utilisant des Promise)

// == Import
import '../../styles/accueilAdmin.css';

//== Import from Semantic UI
import { Card, Image } from 'semantic-ui-react'


const AccueilAdmin = ({heros, setSearchedText}) => {

  useEffect(() => {
    window.scrollTo(0, 0)
    setSearchedText('')
  }, [])

  return (
    <div className="accueilAdmin">

    <Card.Group centered >
      {heros.map((hero) => (
        <Card key={hero.prenom}>
          <Image src={hero.avatar} wrapped ui={false} />
          <Card.Content>
            <Card.Header>{hero.prenom}</Card.Header>
            <Card.Meta>
              <span className='date'>{hero.alias}</span>
            </Card.Meta>
            <Card.Description>
              {hero.description}
            </Card.Description>
          </Card.Content>
        </Card>
      ))}
    
    </Card.Group>
    </div>
  )
      }
  // == Export
  export default AccueilAdmin;
