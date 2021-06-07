import React, { useState, useEffect } from 'react';
// bibliothèque pour faciliter les appels AJAX (en utilisant des Promise)

// IMPORTER LoginForm!!!!!!!!
import LoginForm from 'src/components/LoginForm';
// == Import
import '../../styles/LoginPage.css';

//== Import from Semantic UI
import { Grid } from 'semantic-ui-react'


const LoginPage = ({
  setActiveRole, 
  setUserId, 
  base_url, 
  setActiveItem,
  setSearchedText
}) => {
  

  useEffect(() => {
    window.scrollTo(0, 0)
    setSearchedText('')
  }, [])

  return (

 <div className="login-page">
    <Grid textAlign='center'>
      <Grid.Column>
        <LoginForm
        setActiveRole={setActiveRole}
        setUserId={setUserId}
        base_url={base_url}
        setActiveItem={setActiveItem}
        />
      </Grid.Column>
    </Grid>
 </div>
)}
  
  // == Export
  export default LoginPage;
